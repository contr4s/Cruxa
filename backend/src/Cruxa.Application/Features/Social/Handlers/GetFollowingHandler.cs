using Mapster;
using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class GetFollowingHandler : IRequestHandler<GetFollowingQuery, Result<List<UserDto>>>
{
    private readonly IFollowerRepository _followerRepo;
    private readonly IUserRepository _userRepo;

    public GetFollowingHandler(IFollowerRepository followerRepo, IUserRepository userRepo)
    {
        _followerRepo = followerRepo;
        _userRepo = userRepo;
    }

    public async Task<Result<List<UserDto>>> Handle(GetFollowingQuery request, CancellationToken ct)
    {
        var followingIds = await _followerRepo.GetFollowingAsync(request.UserId);
        var users = await _userRepo.GetByIdsAsync(followingIds.ToList());
        return Result.Success(users.Select(u => u.Adapt<UserDto>()).ToList());
    }
}
