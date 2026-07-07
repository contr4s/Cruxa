namespace Cruxa.Domain.Entities;

using Abstractions;

/// <summary>
/// JWT refresh token for long-lived sessions. 1:N with User.
/// </summary>
public class RefreshToken : Entity<Guid>
{
    public Guid UserId { get; private set; }
    public string Token { get; private set; }
    public DateTime ExpiresAt { get; private set; }
    public bool IsRevoked { get; private set; }
    public User User { get; private set; } = null!;

    private RefreshToken() { }

    public RefreshToken(Guid userId, string token, DateTime expiresAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
    }

    public void Revoke() => IsRevoked = true;

    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
    public bool IsActive => !IsRevoked && !IsExpired;
}
