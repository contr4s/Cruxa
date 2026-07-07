namespace Cruxa.Application.Common.Interfaces;

using Domain.Entities;

public interface IJwtTokenGenerator
{
    Task<string> GenerateAccessTokenAsync(User user);
    Task<string> GenerateRefreshTokenAsync();
}
