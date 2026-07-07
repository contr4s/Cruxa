namespace Cruxa.Domain.Entities;

using Abstractions;

/// <summary>
/// Password-based credential for local authentication (1:1 with User).
/// Separated from User entity to support multiple authentication methods (OAuth, etc.).
/// </summary>
public class PasswordCredential : Entity<Guid>
{
    public Guid UserId { get; private set; }
    public string PasswordHash { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private PasswordCredential() { }

    public PasswordCredential(Guid userId, string passwordHash)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        PasswordHash = passwordHash;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateHash(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
    }
}
