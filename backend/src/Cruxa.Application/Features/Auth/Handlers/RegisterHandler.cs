using Mapster;
using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Auth.Commands;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;

namespace Cruxa.Application.Features.Auth.Handlers;

public class RegisterHandler(
    IUserRepository users,
    IPasswordCredentialRepository passwordCredentials,
    IRefreshTokenRepository refreshTokenRepo,
    IJwtTokenGenerator jwt,
    IPasswordHasher passwordHasher)
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

        var userResult = User.Create(emailResult.Value, cmd.Username, cmd.FirstName, cmd.LastName, cmd.Gender, cmd.Height, cmd.City);
        if (userResult.IsFailure)
            return Result.Failure<AuthResponse>(userResult.Error);

        var user = userResult.Value;
        await users.AddAsync(user);

        var passwordHash = passwordHasher.Hash(cmd.Password);
        var credential = new PasswordCredential(user.Id, passwordHash);
        await passwordCredentials.AddAsync(credential);

        var token = await jwt.GenerateAccessTokenAsync(user);
        var refreshToken = await jwt.GenerateRefreshTokenAsync();
        var rt = new RefreshToken(user.Id, refreshToken, DateTime.UtcNow.AddDays(7));
        await refreshTokenRepo.AddAsync(rt);

        return new AuthResponse
        {
            Token = token,
            User = user.Adapt<Users.DTOs.UserDto>()
        };
    }

}
