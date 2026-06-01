using System.Security.Cryptography;
using Mapster;
using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Auth.Commands;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;

namespace Cruxa.Application.Features.Auth.Handlers;

public class RegisterHandler(IUserRepository users, IJwtTokenGenerator jwt)
    : IRequestHandler<RegisterCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(RegisterCommand cmd, CancellationToken ct)
    {
        if (await users.ExistsByEmailAsync(cmd.Email))
            return Error.Conflict("Email already registered");

        if (await users.ExistsByUsernameAsync(cmd.Username))
            return Error.Conflict("Username already taken");

        var emailResult = Email.Create(cmd.Email);
        if (emailResult.IsFailure)
            return Result.Failure<AuthResponse>(emailResult.Error);

        var passwordHash = HashPassword(cmd.Password);

        var userResult = User.Create(emailResult.Value, cmd.Username, passwordHash);
        if (userResult.IsFailure)
            return Result.Failure<AuthResponse>(userResult.Error);

        var user = userResult.Value;
        if (cmd.City is not null)
            user.UpdateProfile(null, cmd.City);

        await users.AddAsync(user);

        var token = await jwt.GenerateTokenAsync(user);
        var userDto = user.Adapt<UserDto>();

        return new AuthResponse { Token = token, User = userDto };
    }

    private static string HashPassword(string password)
    {
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16];
        rng.GetBytes(salt);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);
        var hashBytes = new byte[48];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 32);
        return Convert.ToBase64String(hashBytes);
    }
}
