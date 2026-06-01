using Mapster;
using MediatR;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Queries;

namespace Cruxa.Application.Features.Users.Handlers;

public class GetUserByIdHandler(IUserRepository users) : IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(GetUserByIdQuery q, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(q.Id);
        return user is null ? Result.Failure<UserDto>(Error.NotFound("User")) : Result.Success(user.Adapt<UserDto>());
    }
}

public class GetUserByUsernameHandler(IUserRepository users) : IRequestHandler<GetUserByUsernameQuery, Result<UserDto>>
{
    public async Task<Result<UserDto>> Handle(GetUserByUsernameQuery q, CancellationToken ct)
    {
        var user = await users.GetByUsernameAsync(q.Username);
        return user is null ? Result.Failure<UserDto>(Error.NotFound("User")) : Result.Success(user.Adapt<UserDto>());
    }
}

public class GetAllUsersHandler(IUserRepository users) : IRequestHandler<GetAllUsersQuery, Result<IEnumerable<UserDto>>>
{
    public async Task<Result<IEnumerable<UserDto>>> Handle(GetAllUsersQuery _, CancellationToken ct)
    {
        var all = await users.GetAllAsync();
        return Result.Success(all.Select(u => u.Adapt<UserDto>()));
    }
}
