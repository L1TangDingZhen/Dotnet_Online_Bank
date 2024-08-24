using LOG.DbContext;
using LOG.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LOG.Services
{
    public class TransferProcessingService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public TransferProcessingService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                        // 查找所有未处理的转账请求
                        var pendingTransfers = context.TransferRequests
                            .Where(t => t.Status == TransferStatus.Pending)
                            .ToList();

                        foreach (var transferRequest in pendingTransfers)
                        {
                            var fromAccount = await context.Accounts.FindAsync(transferRequest.FromAccountId);
                            var toAccount = await context.Accounts.SingleOrDefaultAsync(a => a.BSB == transferRequest.ToBSB && a.AccountNumber == transferRequest.ToAccountNumber);

                            if (fromAccount != null && toAccount != null && fromAccount.Balance >= transferRequest.Amount)
                            {
                                // 执行转账操作
                                fromAccount.Balance -= transferRequest.Amount;
                                toAccount.Balance += transferRequest.Amount;

                                // 创建交易记录
                                var transaction = new Transaction
                                {
                                    AccountId = fromAccount.AccountId,
                                    RecipientAccountId = toAccount.AccountId,
                                    Amount = transferRequest.Amount,
                                    TransactionType = "Transfer",
                                    TransactionDate = DateTime.Now
                                };
                                context.Transactions.Add(transaction);

                                // 标记转账请求为成功
                                transferRequest.Status = TransferStatus.Success;
                            }
                            else
                            {
                                // 标记转账请求为失败
                                transferRequest.Status = TransferStatus.Failed;
                            }

                            await context.SaveChangesAsync();
                        }


                    }
                }
                catch (Exception ex)
                {
                    // 在这里记录异常日志，避免任务取消
                    Console.WriteLine($"Error in TransferProcessingService: {ex.Message}");
                }

                // 等待一段时间后再次执行检查，设置为3秒
                await Task.Delay(TimeSpan.FromSeconds(3), stoppingToken);
            }
        }
    }
}
