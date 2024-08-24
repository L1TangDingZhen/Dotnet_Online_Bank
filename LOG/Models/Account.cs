using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LOG.Models;
namespace LOG.Models
{
    public class Account
    {
        [Key]
        public int AccountId { get; set; }

        [Required]
        [Column(TypeName = "varchar(9)")]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "varchar(6)")]
        public string BSB { get; set; } = string.Empty;

        [Required]
        public decimal Balance { get; set; } = 0.0M;

        [Required]
        public AccountType Type { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public virtual User User { get; set; } = default!;

        [Required]
        [Column(TypeName = "varchar(6)")]  // 假设交易密码为6位数字
        public string Pin { get; set; } = string.Empty;

    }


    public enum AccountType
    {
        Savings,
        Checking
    }
}
