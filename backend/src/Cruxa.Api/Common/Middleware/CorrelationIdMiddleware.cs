using Serilog.Context;

namespace Cruxa.Api.Common.Middleware;

public class CorrelationIdMiddleware(RequestDelegate next)
{
    private const string _headerName = "X-Correlation-Id";

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers.TryGetValue(_headerName, out var headerValue)
            ? headerValue.ToString()
            : Guid.NewGuid().ToString();

        context.Response.Headers[_headerName] = correlationId;

        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await next(context);
        }
    }
}
