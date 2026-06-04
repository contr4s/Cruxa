using Mapster;
using MediatR;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Queries;

namespace Cruxa.Application.Features.Users.Handlers;

public class GetAllUsersHandler(IUserRepository users) : IRequestHandler<GetAllUsersQuery, Result<IEnumerable<UserDto>>>
{
    public async Task<Result<IEnumerable<UserDto>>> Handle(GetAllUsersQuery _, CancellationToken ct)
    {
        var all = await users.GetAllAsync();
        return Result.Success(all.Select(u => u.Adapt<UserDto>()));
    }
}
