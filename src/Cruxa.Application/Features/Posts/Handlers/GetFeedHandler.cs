using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Domain.Enums;

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
        var following = await _followerRepository.GetFollowingAsync(request.UserId);
        var userIds = new List<Guid>(following) { request.UserId };

        var allPosts = await _postRepository.GetByUserIdsAsync(userIds);
        var publishedPosts = allPosts.Where(p => p.Status == PostStatus.Published).ToList();

        var totalCount = publishedPosts.Count;

        var feed = publishedPosts
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(GetPostByIdHandler.MapToDto)
            .ToList();

        return Result.Success(new OffsetPaginatedList<PostDto>(
            feed, totalCount, request.Page, request.PageSize));
    }
}
