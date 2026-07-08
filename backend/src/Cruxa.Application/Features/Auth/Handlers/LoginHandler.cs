using Mapster;
using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Auth.Commands;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Auth.Handlers;

public class LoginHandler(
    IUserRepository users,
    IPasswordCredentialRepository passwordCredentials,
    IRefreshTokenRepository refreshTokenRepo,
    IJwtTokenGenerator jwt,
    IPasswordHasher passwordHasher)
    : IRequestHandler<LoginCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(LoginCommand command, CancellationToken ct)
    {
        var user = await users.GetByEmailAsync(command.Email);
        if (user is null)
            return Error.Unauthorized("Invalid email or password");

        var credential = await passwordCredentials.GetByUserIdAsync(user.Id);
        if (credential is null || !passwordHasher.Verify(command.Password, credential.PasswordHash))
            return Error.Unauthorized("Invalid email or password");

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
