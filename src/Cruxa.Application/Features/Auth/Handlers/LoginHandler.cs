using System.Security.Cryptography;
using Mapster;
using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Auth.Queries;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Auth.Handlers;

public class LoginHandler(IUserRepository users, IJwtTokenGenerator jwt)
    : IRequestHandler<LoginQuery, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(LoginQuery query, CancellationToken ct)
    {
        var user = await users.GetByEmailAsync(query.Email);
        if (user == null || !VerifyPassword(query.Password, user.PasswordHash))
            return Error.Unauthorized("Invalid email or password");

        var token = await jwt.GenerateTokenAsync(user);
        var userDto = user.Adapt<UserDto>();

        return new AuthResponse { Token = token, User = userDto };
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        var hashBytes = Convert.FromBase64String(storedHash);
        var salt = new byte[16];
        Array.Copy(hashBytes, 0, salt, 0, 16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);
        for (int i = 0; i < 32; i++)
            if (hashBytes[i + 16] != hash[i])
                return false;
        return true;
    }
}
