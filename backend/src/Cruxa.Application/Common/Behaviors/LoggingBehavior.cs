using MediatR;
using Microsoft.Extensions.Logging;
using Cruxa.Domain.Common;
using System.Diagnostics;

namespace Cruxa.Application.Common.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : class
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
        => _logger = logger;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var requestName = typeof(TRequest).Name;
        var requestId = Guid.NewGuid();

        // Structured logging: Serilog captures @Request as a structured object
        _logger.LogInformation(
            "Processing {RequestName} [RequestId={RequestId}] {@Request}",
            requestName, requestId, request);

        var stopwatch = Stopwatch.StartNew();
        try
        {
            var response = await next(ct);

            stopwatch.Stop();

            // Business failure (Result with IsSuccess = false) → Warning level
            if (response is Result { IsSuccess: false } failure)
            {
                _logger.LogWarning(
                    "Completed {RequestName} [RequestId={RequestId}] in {ElapsedMs}ms — Failure: [{ErrorCode}] {ErrorMessage} {@Request}",
                    requestName, requestId, stopwatch.ElapsedMilliseconds,
                    failure.Error?.Code, failure.Error?.Message, request);
            }
            else
            {
                _logger.LogInformation(
                    "Completed {RequestName} [RequestId={RequestId}] in {ElapsedMs}ms — Success",
                    requestName, requestId, stopwatch.ElapsedMilliseconds);
            }

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex,
                "Failed {RequestName} [RequestId={RequestId}] in {ElapsedMs}ms — Exception: {Message}",
                requestName, requestId, stopwatch.ElapsedMilliseconds, ex.Message);
            throw;
        }
    }
}
