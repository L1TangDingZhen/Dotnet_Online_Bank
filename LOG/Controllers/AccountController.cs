using LOG.DbContext;
using LOG.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using LOG.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace LOG.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AccountController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUser createUser)
        {
            // Validate user data
            if (string.IsNullOrEmpty(createUser.Name) || string.IsNullOrEmpty(createUser.Password) || string.IsNullOrEmpty(createUser.Pin))
            {
                return BadRequest("Invalid user data");
            }

            // Encrypt login password
            var hashedPassword = PasswordHelper.HashPassword(createUser.Password);

            // Create new user
            var user = new User
            {
                Name = createUser.Name,
                Password = hashedPassword,
                IsActivated = true // 默认激活新用户
            };

            // Save user to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Automatically create a Checking account for the new user
            var checkingAccount = new Account
            {
                AccountNumber = GenerateUniqueAccountNumber(), // 生成9位的AccountNumber
                BSB = GenerateUniqueBSB(), // 生成6位的BSB
                Balance = 0.0M, // 初始余额为0
                Type = AccountType.Checking,
                UserId = user.Id, // 关联用户
                Pin = createUser.Pin // 设置交易密码
            };

            _context.Accounts.Add(checkingAccount);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully with a Checking account");
        }


        private string GenerateUniqueAccountNumber()
        {
            string accountNumber;
            do
            {
                accountNumber = new Random().Next(100000000, 999999999).ToString();
            } while (_context.Accounts.Any(a => a.AccountNumber == accountNumber));

            return accountNumber;
        }

        private string GenerateUniqueBSB()
        {
            string bsb;
            do
            {
                bsb = new Random().Next(0, 1000000).ToString("D6");
            } while (_context.Accounts.Any(a => a.BSB == bsb));

            return bsb;
        }



        [HttpPost("login")]
        // there are two LoginRuest classes, one in Models and one in Controllers
        public IActionResult Login([FromBody] Models.LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Name) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Invalid login data");
            }
            // Find user
            var user = _context.Users.FirstOrDefault(u => u.Name == loginRequest.Name);

            if (user == null || !PasswordHelper.VerifyPassword(loginRequest.Password, user.Password))
            {
                return Unauthorized("Invalid username or password");
            }

            var token = _jwtService.GenerateToken(user);
            return Ok(new { Token = "Bearer " + token });
        }

        [Authorize]
        [HttpPost("cancel")]
        public IActionResult Cancel([FromBody] User user)
        {
            // Cancel user
            if (user == null || string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Invalid user data");
            }

            var existingUser = _context.Users.SingleOrDefault(u => u.Name == user.Name && PasswordHelper.VerifyPassword(user.Password, u.Password));
            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            existingUser.IsActivated = false; // Deactivate user
            _context.SaveChanges();

            return Ok("User cancelled successfully");
        }

        [Authorize]
        [HttpPost("upgrade")]
        public async Task<IActionResult> Upgrade([FromBody] User user)
        {
            // Upgrade user
            if (user == null || string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Invalid user data");
            }
            var existingUser = await _context.Users.FindAsync(user.Id);
            if (existingUser == null)
            {
                return NotFound("User not found");
            }

            // Update user
            existingUser.Name = user.Name;
            existingUser.Password = PasswordHelper.HashPassword(user.Password);
            await _context.SaveChangesAsync();

            return Ok("User updated successfully");
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // JWT is stateless, logout can be handled on the client side by removing the token
            return Ok("User logged out successfully");
        }

        [HttpGet("all")]
        public IActionResult All()
        {
            return Ok(_context.Users.ToList());
        }

        //[Authorize]
        //[HttpPost("me")]
        //public IActionResult Me()
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    var user = _context.Users.Find(int.Parse(userId));
        //    if (user == null)
        //    {
        //        return NotFound("User not found");
        //    }

        //    return Ok(new { user.Name });
        //}
        //[Authorize]
        //[HttpPost("me")]
        //public IActionResult Me()
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    Console.WriteLine($"User ID from token: {userId}");

        //    if (string.IsNullOrEmpty(userId))
        //    {
        //        return BadRequest("User ID claim not found in token");
        //    }

        //    var user = _context.Users.Find(int.Parse(userId));
        //    if (user == null)
        //    {
        //        return NotFound($"User not found for ID: {userId}");
        //    }

        //    return Ok(new { user.Name });
        //}

        [Authorize]
        [HttpPost("me")]
        public IActionResult Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine($"User ID from token: {userId}");

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID claim not found in token");
            }

            // 查询用户信息及其账户信息
            var user = _context.Users
                .Include(u => u.Accounts)  // 加载与用户关联的账户信息
                .FirstOrDefault(u => u.Id == int.Parse(userId));

            if (user == null)
            {
                return NotFound($"User not found for ID: {userId}");
            }

            // 返回用户信息以及账户信息
            var result = new
            {
                user.Name,
                Accounts = user.Accounts.Select(account => new
                {
                    account.AccountNumber,
                    account.BSB,
                    account.Balance,
                    account.Type
                }).ToList()
            };

            return Ok(result);
        }




        [Authorize]
        [HttpPost("refresh")]
        public IActionResult Add(double A, double B)
        {
            var result = A + B;
            return Ok(result);
        }

        [Authorize]
        [HttpGet("balances")]
        public async Task<IActionResult> GetBalances()
        {
            // 从 JWT Token 中获取用户 ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID claim not found in token");
            }

            // 查询属于该用户的所有账户
            var accounts = await _context.Accounts
                .Where(a => a.UserId == int.Parse(userId))
                .Select(a => new
                {
                    a.AccountNumber,
                    a.BSB,
                    a.Balance,
                    a.Type
                })
                .ToListAsync();

            if (accounts == null || accounts.Count == 0)
            {
                return NotFound("No accounts found for this user");
            }

            return Ok(accounts);
        }

    }

    public static class PasswordHelper
    {
        public static string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return $"{Convert.ToBase64String(salt)}.{hashed}";
        }

        public static bool VerifyPassword(string inputPassword, string storedPassword)
        {
            var parts = storedPassword.Split('.');
            var salt = Convert.FromBase64String(parts[0]);
            var hashedPassword = parts[1];

            var hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: inputPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return hashed == hashedPassword;
        }
    }




}
