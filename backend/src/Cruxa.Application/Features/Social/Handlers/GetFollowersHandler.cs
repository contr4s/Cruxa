using Mapster;
using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class GetFollowersHandler : IRequestHandler<GetFollowersQuery, Result<List<UserDto>>>
{
    private readonly IFollowerRepository _followerRepo;
    private readonly IUserRepository _userRepo;

    public GetFollowersHandler(IFollowerRepository followerRepo, IUserRepository userRepo)
    {
        _followerRepo = followerRepo;
        _userRepo = userRepo;
    }

    public async Task<Result<List<UserDto>>> Handle(GetFollowersQuery request, CancellationToken ct)
    {
        var followerIds = await _followerRepo.GetFollowersAsync(request.UserId);
        var users = await _userRepo.GetByIdsAsync(followerIds.ToList());
        return Result.Success(users.Select(u => u.Adapt<UserDto>()).ToList());
    }
}
