using MediatR;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Application.Features.Users.Commands;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Users.Handlers;

public sealed class ChangePasswordHandler(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher) : IRequestHandler<ChangePasswordCommand, Result>
{
    public async Task<Result> Handle(ChangePasswordCommand request, CancellationToken ct)
    {
        var user = await userRepository.GetByIdAsync(request.UserId);
        if (user is null)
            return Result.Failure(Error.NotFound("User"));

        if (!passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
            return Result.Failure(Error.Validation("Current password is incorrect"));

        var newHash = passwordHasher.Hash(request.NewPassword);
        var changeResult = user.ChangePassword(user.PasswordHash, newHash);
        if (changeResult.IsFailure)
            return changeResult;

        await userRepository.UpdateAsync(user);
        return Result.Success();
    }
}
