namespace Cruxa.Application.Common.Interfaces;

using Domain.Entities;

public interface IJwtTokenGenerator
{
    Task<string> GenerateTokenAsync(User user);
}
