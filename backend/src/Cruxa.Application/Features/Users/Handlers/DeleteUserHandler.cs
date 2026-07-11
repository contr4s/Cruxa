using MediatR;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Users.Commands;

namespace Cruxa.Application.Features.Users.Handlers;

public class DeleteUserHandler(IUserRepository users) : IRequestHandler<DeleteUserCommand, Result>
{
    public async Task<Result> Handle(DeleteUserCommand cmd, CancellationToken ct)
    {
        if (cmd.Id != cmd.CurrentUserId)
            return Result.Failure(Error.Unauthorized("You can only delete your own account"));

        var user = await users.GetByIdAsync(cmd.Id);
        if (user is null)
            return Result.Failure(Error.NotFound("User"));

        await users.DeleteAsync(cmd.Id);
        return Result.Success();
    }
}
