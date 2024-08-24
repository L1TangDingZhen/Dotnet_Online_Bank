using System.ComponentModel.DataAnnotations;

namespace LOG.Models
{
    public class TransferRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int FromAccountId { get; set; }

        [Required]
        public string ToBSB { get; set; } = string.Empty; // 添加BSB字段

        [Required]
        public string ToAccountNumber { get; set; } = string.Empty; // 添加AccountNumber字段

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public TransferStatus Status { get; set; } = TransferStatus.Pending;
    }

    public enum TransferStatus
    {
        Pending,
        Success,
        Failed
    }

    public class TransferForm
    {
        [Required]
        public string BSB { get; set; } = string.Empty;

        [Required]
        public string AccountNumber { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Pin { get; set; } = string.Empty;
    }
}
