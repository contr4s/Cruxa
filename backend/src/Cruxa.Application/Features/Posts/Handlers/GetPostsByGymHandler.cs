using MediatR;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetPostsByGymHandler : IRequestHandler<GetPostsByGymQuery, Result<IEnumerable<PostDto>>>
{
    private readonly IPostRepository _repository;
    private readonly IFollowerRepository _followerRepository;

    public GetPostsByGymHandler(IPostRepository repository, IFollowerRepository followerRepository)
    {
        _repository = repository;
        _followerRepository = followerRepository;
    }

    public async Task<Result<IEnumerable<PostDto>>> Handle(GetPostsByGymQuery request, CancellationToken ct)
    {
        var posts = await _repository.GetByGymIdAsync(request.GymId);

        var followingSet = new HashSet<Guid>();
        if (request.CurrentUserId.HasValue)
        {
            var following = await _followerRepository.GetFollowingAsync(request.CurrentUserId.Value);
            followingSet = new HashSet<Guid>(following);
        }

        var dtos = posts
            .Where(p => p.Status == PostStatus.Published)
            .Where(p =>
                p.Visibility == PostVisibility.Public
                || p.UserId == request.CurrentUserId
                || (p.Visibility == PostVisibility.Followers && followingSet.Contains(p.UserId)))
            .Select(GetPostByIdHandler.MapToDto);
        return Result.Success(dtos);
    }
}
