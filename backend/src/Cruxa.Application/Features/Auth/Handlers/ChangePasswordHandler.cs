using MediatR;
using Cruxa.Application.Features.Auth.Commands;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Application.Common.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Auth.Handlers;

public class ChangePasswordHandler(
    IUserRepository users,
    IPasswordCredentialRepository passwordCredentials,
    IRefreshTokenRepository refreshTokenRepo,
    IPasswordHasher passwordHasher)
    : IRequestHandler<ChangePasswordCommand, Result>
{
    public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(request.UserId);
        if (user is null)
            return Result.Failure(Error.NotFound("User not found"));

        var credential = await passwordCredentials.GetByUserIdAsync(request.UserId);
        if (credential is null)
            return Result.Failure(Error.NotFound("Password credential not found"));

        if (!passwordHasher.Verify(request.CurrentPassword, credential.PasswordHash))
            return Result.Failure(Error.Validation("Current password is incorrect"));

        var newHash = passwordHasher.Hash(request.NewPassword);
        credential.UpdateHash(newHash);
        await passwordCredentials.UpdateAsync(credential);

        await refreshTokenRepo.RevokeUserTokensAsync(request.UserId);

        return Result.Success();
    }
}
