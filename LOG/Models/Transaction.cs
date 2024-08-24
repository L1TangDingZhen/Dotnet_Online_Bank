using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LOG.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string TransactionType { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        public DateTime TransactionDate { get; set; } = DateTime.Now;

        [ForeignKey("Account")]
        public int AccountId { get; set; }

        [Required]
        public virtual Account Account { get; set; } = default!;

        [ForeignKey("RecipientAccount")]
        public int? RecipientAccountId { get; set; }

        [Required]
        public virtual Account? RecipientAccount { get; set; } = default!; // Navigation property to recipient Account for transfers
    }
}
