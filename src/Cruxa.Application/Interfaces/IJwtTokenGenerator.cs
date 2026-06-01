namespace Cruxa.Application.Interfaces;

using Domain.Entities;

public interface IJwtTokenGenerator
{
    Task<string> GenerateTokenAsync(User user);
}
