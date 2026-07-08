using Mapster;
using MediatR;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Commands;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Users.Handlers;

public class UpdateUserHandler(IUserRepository users) : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(UpdateUserCommand cmd, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(cmd.Id);
        if (user is null) return Error.NotFound("User");

        // Only the user themselves or an Admin can update the profile
        if (cmd.CurrentUserId != cmd.Id && user.Role != Role.Admin)
            return Error.Validation("You are not authorized to update this user's profile");

        user.UpdateProfile(cmd.AvatarUrl, cmd.City, cmd.FirstName, cmd.LastName, cmd.Gender, cmd.Height);
        await users.UpdateAsync(user);
        return user.Adapt<UserDto>();
    }
}
