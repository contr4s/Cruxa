namespace Cruxa.Application.Common.Contracts;

/// <summary>
/// Manages database transactions for atomic command execution.
/// Implemented in the Infrastructure layer using EF Core.
/// </summary>
public interface ITransactionManager
{
    /// <summary>
    /// Begins a new database transaction.
    /// </summary>
    Task<ITransaction> BeginTransactionAsync(CancellationToken ct = default);
}

/// <summary>
/// Represents an active database transaction.
/// Must be disposed (via IAsyncDisposable) to release resources.
/// </summary>
public interface ITransaction : IAsyncDisposable
{
    /// <summary>Commits the transaction.</summary>
    Task CommitAsync(CancellationToken ct = default);

    /// <summary>Rolls back the transaction.</summary>
    Task RollbackAsync(CancellationToken ct = default);
}
