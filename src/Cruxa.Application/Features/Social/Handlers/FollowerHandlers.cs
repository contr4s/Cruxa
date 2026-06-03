using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class FollowUserHandler : IRequestHandler<FollowUserCommand, Result>
{
    private readonly IFollowerRepository _repository;

    public FollowUserHandler(IFollowerRepository repository) => _repository = repository;

    public async Task<Result> Handle(FollowUserCommand request, CancellationToken ct)
    {
        if (request.FollowerId == request.FolloweeId)
            return Result.Failure(Error.Validation("Cannot follow yourself"));

        var followed = await _repository.FollowAsync(request.FollowerId, request.FolloweeId);
        return followed ? Result.Success() : Result.Failure(Error.Conflict("Already following"));
    }
}

public sealed class UnfollowUserHandler : IRequestHandler<UnfollowUserCommand, Result>
{
    private readonly IFollowerRepository _repository;

    public UnfollowUserHandler(IFollowerRepository repository) => _repository = repository;

    public async Task<Result> Handle(UnfollowUserCommand request, CancellationToken ct)
    {
        var unfollowed = await _repository.UnfollowAsync(request.FollowerId, request.FolloweeId);
        return unfollowed ? Result.Success() : Result.Failure(Error.NotFound("Not following"));
    }
}

public sealed class GetFollowersHandler : IRequestHandler<GetFollowersQuery, Result<IEnumerable<Guid>>>
{
    private readonly IFollowerRepository _repository;

    public GetFollowersHandler(IFollowerRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<Guid>>> Handle(GetFollowersQuery request, CancellationToken ct)
    {
        var followers = await _repository.GetFollowersAsync(request.UserId);
        return Result.Success(followers);
    }
}

public sealed class GetFollowingHandler : IRequestHandler<GetFollowingQuery, Result<IEnumerable<Guid>>>
{
    private readonly IFollowerRepository _repository;

    public GetFollowingHandler(IFollowerRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<Guid>>> Handle(GetFollowingQuery request, CancellationToken ct)
    {
        var following = await _repository.GetFollowingAsync(request.UserId);
        return Result.Success(following);
    }
}

public sealed class IsFollowingHandler : IRequestHandler<IsFollowingQuery, Result<bool>>
{
    private readonly IFollowerRepository _repository;

    public IsFollowingHandler(IFollowerRepository repository) => _repository = repository;

    public async Task<Result<bool>> Handle(IsFollowingQuery request, CancellationToken ct)
    {
        var isFollowing = await _repository.IsFollowingAsync(request.FollowerId, request.FolloweeId);
        return Result.Success(isFollowing);
    }
}
