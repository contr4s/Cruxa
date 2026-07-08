using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Features.Social.Contracts;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetFeedHandler : IRequestHandler<GetFeedQuery, Result<OffsetPaginatedList<PostDto>>>
{
    private readonly IPostRepository _postRepository;
    private readonly IFollowerRepository _followerRepository;

    public GetFeedHandler(IPostRepository postRepository, IFollowerRepository followerRepository)
    {
        _postRepository = postRepository;
        _followerRepository = followerRepository;
    }

    public async Task<Result<OffsetPaginatedList<PostDto>>> Handle(GetFeedQuery request, CancellationToken ct)
    {
        var currentUserId = request.UserId;
        var following = await _followerRepository.GetFollowingAsync(currentUserId);
        var followingSet = new HashSet<Guid>(following);

        List<Domain.Entities.Post> allPosts;

        if (request.Filter == FeedFilter.Subs)
        {
            // Только посты от подписок (без собственных)
            var posts = await _postRepository.GetByUserIdsAsync(following.ToList());
            allPosts = posts.ToList();
        }
        else
        {
            // Recommended / default — все опубликованные публичные посты
            allPosts = (await _postRepository.GetAllAsync())
                .Where(p => p.Status == PostStatus.Published)
                .ToList();
        }

        var visiblePosts = allPosts
            .Where(p => p.Status == PostStatus.Published)
            .Where(p =>
                p.Visibility == PostVisibility.Public
                || p.UserId == currentUserId
                || (p.Visibility == PostVisibility.Followers && followingSet.Contains(p.UserId)))
            .OrderByDescending(p => p.CreatedAt)
            .ToList();

        var totalCount = visiblePosts.Count;

        var feed = visiblePosts
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(GetPostByIdHandler.MapToDto)
            .ToList();

        return Result.Success(new OffsetPaginatedList<PostDto>(
            feed, totalCount, request.Page, request.PageSize));
    }
}
