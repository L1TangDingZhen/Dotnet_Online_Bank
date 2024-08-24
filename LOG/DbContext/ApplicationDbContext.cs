using Microsoft.EntityFrameworkCore;
using LOG.Models;

namespace LOG.DbContext
{
    public class ApplicationDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // 定义User属性，将User映射到数据库中的Users表, User写到数据库里Users表
        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; } // 将Transaction映射到数据库中的Transactions表
        public DbSet<TransferRequest> TransferRequests { get; set; } // 将TransferRequest映射到数据库中的TransferRequests表
        public DbSet<Account> Accounts { get; set; }

        public DbSet<Deposit> Deposits { get; set; } // 将Deposit映射到数据库中的Deposits表



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 为 Account 实体的 BSB 属性添加约束
            modelBuilder.Entity<Account>()
                .Property(a => a.BSB)
                .HasMaxLength(6)   // 设置 BSB 最大长度为 6
                .IsRequired();     // 设置 BSB 为必填字段

            // 为 Account 实体的 AccountNumber 属性添加约束
            modelBuilder.Entity<Account>()
                .Property(a => a.AccountNumber)
                .HasMaxLength(9)   // 设置 AccountNumber 最大长度为 9
                .IsRequired();     // 设置 AccountNumber 为必填字段
        }
    }
}
