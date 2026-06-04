using Mapster;
using MediatR;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Queries;

namespace Cruxa.Application.Features.Users.Handlers;

public class GetUserByUsernameHandler(IUserRepository users) : IRequestHandler<GetUserByUsernameQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(GetUserByUsernameQuery q, CancellationToken ct)
    {
        var user = await users.GetByUsernameAsync(q.Username);
        return user is null ? Result.Failure<UserDto>(Error.NotFound("User")) : Result.Success(user.Adapt<UserDto>());
    }
}
