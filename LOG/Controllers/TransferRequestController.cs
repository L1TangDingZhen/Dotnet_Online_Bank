using LOG.DbContext;
using LOG.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LOG.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransferRequestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransferRequestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTransferRequest([FromBody] TransferForm transferForm)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is not found in the token.");
            }

            if (!int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Invalid User ID.");
            }

            var fromAccount = await _context.Accounts.SingleOrDefaultAsync(a => a.UserId == parsedUserId && a.Type == AccountType.Checking);
            var toAccount = await _context.Accounts.SingleOrDefaultAsync(a => a.BSB == transferForm.BSB && a.AccountNumber == transferForm.AccountNumber);

            if (fromAccount == null || toAccount == null)
            {
                return NotFound("Account not found.");
            }

            if (transferForm.Amount <= 0)
            {
                return BadRequest("Invalid transfer amount.");
            }

            // 验证交易密码
            if (fromAccount.Pin != transferForm.Pin)
            {
                return Unauthorized("Invalid PIN.");
            }

            if (fromAccount.Balance < transferForm.Amount)
            {
                return BadRequest("Insufficient funds.");
            }

            var transferRequest = new TransferRequest
            {
                FromAccountId = fromAccount.AccountId,
                ToBSB = transferForm.BSB,
                ToAccountNumber = transferForm.AccountNumber,
                Amount = transferForm.Amount,
                Status = TransferStatus.Pending
            };

            _context.TransferRequests.Add(transferRequest);
            await _context.SaveChangesAsync();

            return Ok("Transfer request created successfully.");
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] DepositForm depositForm)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is not found in the token.");
            }

            if (!int.TryParse(userId, out int parsedUserId))
            {
                return BadRequest("Invalid User ID.");
            }

            var fromAccount = await _context.Accounts.SingleOrDefaultAsync(a => a.UserId == parsedUserId && a.Type == AccountType.Checking);

            if (fromAccount == null)
            {
                return NotFound("Account not found.");
            }

            if (depositForm.Amount <= 0)
            {
                return BadRequest("Invalid deposit amount.");
            }

            // 验证交易密码
            if (fromAccount.Pin != depositForm.Pin)
            {
                return Unauthorized("Invalid PIN.");
            }

            // 更新账户余额
            fromAccount.Balance += depositForm.Amount;

            var deposit = new Deposit
            {
                FromAccountId = fromAccount.AccountId,
                Amount = depositForm.Amount,
            };

            _context.Deposits.Add(deposit);
            await _context.SaveChangesAsync();

            return Ok("Deposit request created successfully.");
        }






    }



}
