namespace Cruxa.Application.Features.Users.Contracts;

using Domain.Entities;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task<RefreshToken?> GetActiveByUserIdAsync(Guid userId);
    Task AddAsync(RefreshToken refreshToken);
    Task RevokeUserTokensAsync(Guid userId);
}
