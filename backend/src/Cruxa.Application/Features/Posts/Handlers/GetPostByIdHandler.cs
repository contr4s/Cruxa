using Mapster;
using MediatR;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetPostByIdHandler : IRequestHandler<GetPostByIdQuery, Result<PostDto>>
{
    private readonly IPostRepository _repository;
    private readonly IFollowerRepository _followerRepository;

    public GetPostByIdHandler(IPostRepository repository, IFollowerRepository followerRepository)
    {
        _repository = repository;
        _followerRepository = followerRepository;
    }

    public async Task<Result<PostDto>> Handle(GetPostByIdQuery request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure<PostDto>(Error.NotFound("Post not found"));

        // Visibility check
        if (post.Visibility == PostVisibility.Private && post.UserId != request.CurrentUserId)
            return Result.Failure<PostDto>(Error.NotFound("Post not found"));

        if (post.Visibility == PostVisibility.Followers && request.CurrentUserId.HasValue && post.UserId != request.CurrentUserId)
        {
            var isFollowing = await _followerRepository.IsFollowingAsync(request.CurrentUserId.Value, post.UserId);
            if (!isFollowing)
                return Result.Failure<PostDto>(Error.NotFound("Post not found"));
        }

        return Result.Success(MapToDto(post));
    }

    public static PostDto MapToDto(Domain.Entities.Post post)
    {
        var ascents = post.Ascents.ToList();
        var totalRoutes = ascents.Count;
        var grades = ascents.Select(a => a.Route?.Grade).Where(g => g is not null).ToList();
        var maxGrade = grades.Count > 0 ? grades.MaxBy(g => g!.Index) : null;
        var avgIndex = grades.Count > 0 ? (int)Math.Round(grades.Average(g => g!.Index)) : 0;
        var avgGrade = grades.Count > 0 ? grades.FirstOrDefault(g => g!.Index >= avgIndex)?.Raw ?? "" : "";
        return new PostDto
        {
            Id = post.Id,
            UserId = post.UserId,
            Username = post.User?.Username ?? "",
            UserAvatarUrl = post.User?.AvatarUrl,
            DisplayName = post.User is not null ? $"{post.User.FirstName} {post.User.LastName}".Trim() : "",
            GymId = post.GymId,
            GymName = post.Gym?.Name ?? "",
            Description = post.Description,
            MediaUrls = post.MediaUrls.ToList(),
            Visibility = post.Visibility,
            Status = post.Status,
            CreatedAt = post.CreatedAt,
            LikesCount = post.Likes.Count,
            CommentsCount = post.Comments.Count,
            Duration = post.Duration,
            IsLiked = false,
            Stats = new PostStatsDto
            {
                DeltaKruskor = post.DeltaKruskor ?? 0,
                AvgGrade = avgGrade,
                Duration = post.Duration,
                TotalRoutes = totalRoutes,
                MaxGrade = maxGrade?.Raw,
            },
            Ascents = ascents.Adapt<List<AscentDto>>()
        };
    }
}
