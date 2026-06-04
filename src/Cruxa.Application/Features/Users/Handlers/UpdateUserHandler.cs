using Mapster;
using MediatR;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Application.Features.Users.Commands;

namespace Cruxa.Application.Features.Users.Handlers;

public class UpdateUserHandler(IUserRepository users, IUnitOfWork uow) : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(UpdateUserCommand cmd, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(cmd.Id);
        if (user is null) return Error.NotFound("User");

        user.UpdateProfile(cmd.AvatarUrl, cmd.City);
        await users.UpdateAsync(user);
        await uow.SaveChangesAsync(ct);
        return user.Adapt<UserDto>();
    }
}
