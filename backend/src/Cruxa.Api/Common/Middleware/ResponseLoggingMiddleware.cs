using System.Text;

namespace Cruxa.Api.Common.Middleware;

public class ResponseLoggingMiddleware(RequestDelegate next, ILogger<ResponseLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        // Buffer the response body so we can read it after the next middleware runs
        var originalBody = context.Response.Body;
        using var buffer = new MemoryStream();
        context.Response.Body = buffer;

        try
        {
            await next(context);

            var statusCode = context.Response.StatusCode;

            // Only log 4xx and 5xx responses (health check excluded)
            if (statusCode >= 400 && context.Request.Path != "/_health")
            {
                buffer.Position = 0;
                var body = await new StreamReader(buffer, Encoding.UTF8).ReadToEndAsync();

                if (statusCode >= 500)
                {
                    logger.LogError(
                        "Response {StatusCode} for {Method} {Path}: {Body}",
                        statusCode, context.Request.Method, context.Request.Path, body);
                }
                else
                {
                    logger.LogWarning(
                        "Response {StatusCode} for {Method} {Path}: {Body}",
                        statusCode, context.Request.Method, context.Request.Path, body);
                }
            }

            buffer.Position = 0;
            await buffer.CopyToAsync(originalBody);
        }
        finally
        {
            context.Response.Body = originalBody;
        }
    }
}
