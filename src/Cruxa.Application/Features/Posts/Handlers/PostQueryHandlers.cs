using MediatR;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Social.Interfaces;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetPostByIdHandler : IRequestHandler<GetPostByIdQuery, Result<PostDto>>
{
    private readonly IPostRepository _repository;

    public GetPostByIdHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<PostDto>> Handle(GetPostByIdQuery request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure<PostDto>(Error.NotFound("Post not found"));

        return Result.Success(MapToDto(post));
    }

    internal static PostDto MapToDto(Domain.Entities.Post post) => new()
    {
        Id = post.Id,
        UserId = post.UserId,
        Username = post.User?.Username ?? "",
        GymId = post.GymId,
        GymName = post.Gym?.Name ?? "",
        Description = post.Description,
        MediaUrls = post.MediaUrls.ToList(),
        Visibility = post.Visibility,
        Status = post.Status,
        CreatedAt = post.CreatedAt,
        LikesCount = post.Likes.Count,
        CommentsCount = post.Comments.Count,
        Ascents = post.Ascents.Select(a => new AscentDto
        {
            Id = a.Id,
            RouteId = a.RouteId,
            GradeRaw = a.Route?.Grade?.Raw ?? "",
            Style = a.Style,
            MediaUrls = a.MediaUrls.ToList(),
            CreatedAt = a.CreatedAt
        }).ToList()
    };
}

public sealed class GetPostsByUserHandler : IRequestHandler<GetPostsByUserQuery, Result<IEnumerable<PostDto>>>
{
    private readonly IPostRepository _repository;

    public GetPostsByUserHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<PostDto>>> Handle(GetPostsByUserQuery request, CancellationToken ct)
    {
        var posts = await _repository.GetByUserIdAsync(request.UserId);
        var dtos = posts.Select(GetPostByIdHandler.MapToDto);
        return Result.Success(dtos);
    }
}

public sealed class GetPostsByGymHandler : IRequestHandler<GetPostsByGymQuery, Result<IEnumerable<PostDto>>>
{
    private readonly IPostRepository _repository;

    public GetPostsByGymHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<PostDto>>> Handle(GetPostsByGymQuery request, CancellationToken ct)
    {
        var posts = await _repository.GetByGymIdAsync(request.GymId);
        var dtos = posts.Select(GetPostByIdHandler.MapToDto);
        return Result.Success(dtos);
    }
}

public sealed class GetFeedHandler : IRequestHandler<GetFeedQuery, Result<IEnumerable<PostDto>>>
{
    private readonly IPostRepository _postRepository;
    private readonly IFollowerRepository _followerRepository;

    public GetFeedHandler(IPostRepository postRepository, IFollowerRepository followerRepository)
    {
        _postRepository = postRepository;
        _followerRepository = followerRepository;
    }

    public async Task<Result<IEnumerable<PostDto>>> Handle(GetFeedQuery request, CancellationToken ct)
    {
        var following = await _followerRepository.GetFollowingAsync(request.UserId);
        var userIds = new List<Guid>(following) { request.UserId };

        var allPosts = new List<Domain.Entities.Post>();
        foreach (var uid in userIds)
        {
            var posts = await _postRepository.GetByUserIdAsync(uid);
            allPosts.AddRange(posts.Where(p => p.Status == Domain.Enums.PostStatus.Published));
        }

        var feed = allPosts
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize);

        return Result.Success(feed.Select(GetPostByIdHandler.MapToDto));
    }
}
