using Mapster;
using MediatR;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Commands;

namespace Cruxa.Application.Features.Users.Handlers;

public class UpdateUserHandler(IUserRepository users) : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(UpdateUserCommand cmd, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(cmd.Id);
        if (user is null) return Error.NotFound("User");

        user.UpdateProfile(cmd.AvatarUrl, cmd.City);
        await users.UpdateAsync(user);
        return user.Adapt<UserDto>();
    }
}

public class DeleteUserHandler(IUserRepository users) : IRequestHandler<DeleteUserCommand, Result>
{
    public async Task<Result> Handle(DeleteUserCommand cmd, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(cmd.Id);
        if (user is null)
            return Result.Failure(Error.NotFound("User"));

        await users.DeleteAsync(cmd.Id);
        return Result.Success();
    }
}
