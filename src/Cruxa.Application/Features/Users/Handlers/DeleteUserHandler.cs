using MediatR;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Application.Features.Users.Commands;

namespace Cruxa.Application.Features.Users.Handlers;

public class DeleteUserHandler(IUserRepository users, IUnitOfWork uow) : IRequestHandler<DeleteUserCommand, Result>
{
    public async Task<Result> Handle(DeleteUserCommand cmd, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(cmd.Id);
        if (user is null)
            return Result.Failure(Error.NotFound("User"));

        await users.DeleteAsync(cmd.Id);
        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
