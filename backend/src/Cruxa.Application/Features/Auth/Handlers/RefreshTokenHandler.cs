using Mapster;
using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Auth.Commands;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Application.Common.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Auth.Handlers;

public class RefreshTokenHandler(
    IRefreshTokenRepository refreshTokenRepo,
    IJwtTokenGenerator jwt)
    : IRequestHandler<RefreshTokenCommand, Result<AuthResponse>>
{
    public async Task<Result<AuthResponse>> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var storedToken = await refreshTokenRepo.GetByTokenAsync(request.RefreshToken);
        if (storedToken is null || !storedToken.IsActive)
            return Error.Unauthorized("Invalid or expired refresh token");

        storedToken.Revoke();
        var user = storedToken.User;

        var newAccessToken = await jwt.GenerateAccessTokenAsync(user);
        var newRefreshToken = await jwt.GenerateRefreshTokenAsync();
        var newRt = new RefreshToken(user.Id, newRefreshToken, DateTime.UtcNow.AddDays(7));
        await refreshTokenRepo.AddAsync(newRt);

        return new AuthResponse
        {
            Token = newAccessToken,
            User = user.Adapt<Users.DTOs.UserDto>()
        };
    }
}
