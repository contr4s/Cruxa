using Cruxa.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace Cruxa.Infrastructure.Persistence;

internal sealed class TransactionManager(CruxaDbContext context) : ITransactionManager
{
    public async Task<ITransaction> BeginTransactionAsync(CancellationToken ct = default)
    {
        var efTransaction = await context.Database.BeginTransactionAsync(ct);
        return new EfTransaction(efTransaction, context);
    }

    private sealed class EfTransaction(IDbContextTransaction transaction, CruxaDbContext context)
        : ITransaction
    {
        public async Task CommitAsync(CancellationToken ct = default)
        {
            await context.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
        }

        public Task RollbackAsync(CancellationToken ct = default)
            => transaction.RollbackAsync(ct);

        public ValueTask DisposeAsync()
            => transaction.DisposeAsync();
    }
}
