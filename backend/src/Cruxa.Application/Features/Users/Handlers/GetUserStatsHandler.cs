using MediatR;
using Cruxa.Application.Features.Users.Queries;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Users.Handlers;

public sealed class GetUserStatsHandler(
    IUserRepository users,
    IFollowerRepository followers,
    IPostRepository posts)
    : IRequestHandler<GetUserStatsQuery, Result<UserStatsDto>>
{
    public async Task<Result<UserStatsDto>> Handle(GetUserStatsQuery request, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(request.UserId);
        if (user is null)
            return Result.Failure<UserStatsDto>(Error.NotFound("User not found"));

        var followersCount = (await followers.GetFollowersAsync(request.UserId)).Count();
        var followingCount = (await followers.GetFollowingAsync(request.UserId)).Count();

        return new UserStatsDto
        {
            Kruscore = 0, // Track B
            TotalWorkouts = 0, // Track B
            FollowersCount = followersCount,
            FollowingCount = followingCount
        };
    }
}
