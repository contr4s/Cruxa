namespace Cruxa.Infrastructure.Persistence;

using Cruxa.Application.Common.Interfaces;

internal sealed class UnitOfWork(CruxaDbContext context) : IUnitOfWork
{
    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await context.SaveChangesAsync(ct);
}
