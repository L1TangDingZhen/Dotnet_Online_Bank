using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LOG.Models
{

    public class Deposit
    {


        [Key]
        public int Id { get; set; }


        [Required]
        public int FromAccountId { get; set; }


        [Required]
        public decimal Amount { get; set; }


    }


    public class DepositForm
    {


        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Pin { get; set; } = string.Empty;

    }
}
