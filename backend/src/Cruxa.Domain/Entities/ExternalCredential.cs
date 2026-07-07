namespace Cruxa.Domain.Entities;

using Abstractions;

/// <summary>
/// External OAuth credential (Google, VK, Telegram, etc.).
/// 1:N with User — a user can link multiple providers.
/// </summary>
public class ExternalCredential : Entity<Guid>
{
    public Guid UserId { get; private set; }
    public string Provider { get; private set; } = string.Empty;
    public string ProviderUserId { get; private set; } = string.Empty;

    private ExternalCredential() { }

    public ExternalCredential(Guid userId, string provider, string providerUserId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Provider = provider;
        ProviderUserId = providerUserId;
    }
}
