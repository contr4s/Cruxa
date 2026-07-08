using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Application.Features.Statistics.Services;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetUserStatsHandler(
    IUserRepository users,
    IStatsRepository statsRepo,
    IFollowerRepository followers)
    : IRequestHandler<GetUserStatsQuery, Result<UserStatsDto>>
{
    public async Task<Result<UserStatsDto>> Handle(GetUserStatsQuery request, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(request.UserId);
        if (user is null)
            return Result.Failure<UserStatsDto>(Error.NotFound("User not found"));

        var score = await statsRepo.GetLastSnapshotBeforeAsync(request.UserId, DateOnly.MaxValue);
        var followersCount = (await followers.GetFollowersAsync(request.UserId)).Count();
        var followingCount = (await followers.GetFollowingAsync(request.UserId)).Count();
        var totalWorkouts= await statsRepo.GetPublishedWorkoutsCountAsync(request.UserId);

        return new UserStatsDto
        {
            Kruscore = score?.Score ?? 0,
            TotalWorkouts = totalWorkouts,
            FollowersCount = followersCount,
            FollowingCount = followingCount
        };
    }
}
