using System.Text.Json;

namespace Cruxa.Api.Common.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ArgumentNullException ex)
        {
            logger.LogWarning(ex, "Bad request: {Message} for {RequestPath}", ex.Message, context.Request.Path);
            await WriteProblem(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, "Bad request: {Message} for {RequestPath}", ex.Message, context.Request.Path);
            await WriteProblem(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Not found: {Message} for {RequestPath}", ex.Message, context.Request.Path);
            await WriteProblem(context, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception processing {RequestPath}", context.Request.Path);
            await WriteProblem(context, StatusCodes.Status500InternalServerError, "Internal server error");
        }
    }

    private static async Task WriteProblem(HttpContext context, int status, string detail)
    {
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";

        var problem = new
        {
            Title = status switch
            {
                400 => "Bad Request",
                401 => "Unauthorized",
                404 => "Not Found",
                500 => "Internal Server Error",
                _ => "Error"
            },
            Status = status,
            Detail = detail
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
    }
}
