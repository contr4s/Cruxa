using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetPostsByUserHandler : IRequestHandler<GetPostsByUserQuery, Result<OffsetPaginatedList<PostDto>>>
{
    private readonly IPostRepository _repository;
    private readonly IFollowerRepository _followerRepository;

    public GetPostsByUserHandler(IPostRepository repository, IFollowerRepository followerRepository)
    {
        _repository = repository;
        _followerRepository = followerRepository;
    }

    public async Task<Result<OffsetPaginatedList<PostDto>>> Handle(GetPostsByUserQuery request, CancellationToken ct)
    {
        var (items, totalCount) = await _repository.GetPagedByUserIdAsync(request.UserId, request.Page, request.PageSize);

        var followingSet = new HashSet<Guid>();
        if (request.CurrentUserId.HasValue)
        {
            var following = await _followerRepository.GetFollowingAsync(request.CurrentUserId.Value);
            followingSet = new HashSet<Guid>(following);
        }

        var filtered = items
            .Where(p => p.Status == PostStatus.Published)
            .Where(p =>
                p.Visibility == PostVisibility.Public
                || p.UserId == request.CurrentUserId
                || (p.Visibility == PostVisibility.Followers && followingSet.Contains(p.UserId)))
            .ToList();

        var dtos = filtered.Select(GetPostByIdHandler.MapToDto).ToList();
        return Result.Success(new OffsetPaginatedList<PostDto>(dtos, filtered.Count, request.Page, request.PageSize));
    }
}
