namespace Cruxa.Application.Common.Contracts;

/// <summary>
/// Provides access to the current authenticated user's information.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// Returns the current user's ID, or null if the request is unauthenticated.
    /// </summary>
    Guid? GetUserId();

    /// <summary>
    /// Returns the current user's ID. Throws if unauthenticated.
    /// </summary>
    Guid GetRequiredUserId();
}
