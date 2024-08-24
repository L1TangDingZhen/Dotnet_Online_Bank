using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LOG.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Password { get; set; } = string.Empty;

        public bool IsActivated { get; set; } = true;

        public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();

    }

    public class LoginRequest
    {
        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Password { get; set; } = string.Empty;
    }

    public class CreateUser
    {
        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Password { get; set; } = string.Empty;


        [Required]
        [Column(TypeName = "varchar(6)")]  // 假设交易密码为6位数字
        public string Pin { get; set; } = string.Empty;

    }
}
