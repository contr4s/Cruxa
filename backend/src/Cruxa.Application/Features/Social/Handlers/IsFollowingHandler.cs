using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

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
