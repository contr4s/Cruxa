using System.Security.Claims;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Api.Common;

/// <summary>
/// Resolves the current user ID from the HTTP context's claims principal.
/// Registered as Scoped — one instance per request.
/// </summary>
public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid? GetUserId()
    {
        var value = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return value is not null && Guid.TryParse(value, out var id) ? id : null;
    }

    public Guid GetRequiredUserId()
    {
        var value = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User is not authenticated.");
        return Guid.TryParse(value, out var id)
            ? id
            : throw new UnauthorizedAccessException("Invalid user identifier in token.");
    }
}
