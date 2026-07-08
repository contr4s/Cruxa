namespace Cruxa.Application.Common.Contracts;

using Domain.Entities;

public interface IJwtTokenGenerator
{
    Task<string> GenerateAccessTokenAsync(User user);
    Task<string> GenerateRefreshTokenAsync();
}
