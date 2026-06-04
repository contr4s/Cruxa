using MediatR;
using Microsoft.Extensions.Logging;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Common.Behaviors;

/// <summary>
/// Pipeline behavior that wraps all command executions (requests implementing <see cref="ICommand"/>)
/// in an explicit database transaction.
///
/// Behaviour:
/// 1. Skip queries (read-only) — no transaction needed.
/// 2. For commands: begin a transaction, execute the handler, commit on success,
///    rollback when Result.IsFailure or an exception is thrown.
/// 3. CommitAsync automatically calls SaveChangesAsync before committing the
///    underlying EF Core transaction, so handlers do not need to manage persistence.
/// 4. If no ITransactionManager is registered (unit tests with mocked mediator),
///    the behavior silently passes through.
/// </summary>
public class TransactionBehavior<TRequest, TResponse>(
    ITransactionManager transactionManager,
    ILogger<TransactionBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : class
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        // Only wrap commands (mutations) in transactions.

        if (request is not ICommand)
            return await next(ct);

        var requestName = typeof(TRequest).Name;

        await using var transaction = await transactionManager.BeginTransactionAsync(ct);
        logger.LogDebug("Transaction started for {RequestName}", requestName);

        try
        {
            var response = await next(ct);

            // If the handler returned a business failure, roll back.
            if (response is Result { IsSuccess: false } failure)
            {
                logger.LogInformation(
                    "Transaction rolled back for {RequestName} — Failure: [{ErrorCode}] {ErrorMessage}",
                    requestName, failure.Error.Code, failure.Error.Message);
                await transaction.RollbackAsync(ct);
                return response;
            }

            // Success — commit (also calls SaveChangesAsync internally).
            logger.LogDebug("Transaction committed for {RequestName}", requestName);
            await transaction.CommitAsync(ct);
            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Transaction rolled back for {RequestName} due to exception", requestName);
            await transaction.RollbackAsync(ct);
            throw;
        }
    }
}
