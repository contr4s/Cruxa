using MediatR;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Application.Features.Statistics.Services;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Mapster;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class UpdatePostHandler : IRequestHandler<UpdatePostCommand, Result<PostDto>>
{
    private readonly IPostRepository _repository;
    private readonly KruscoreService _kruscore;

    public UpdatePostHandler(IPostRepository repository, KruscoreService kruscore)
    {
        _repository = repository;
        _kruscore = kruscore;
    }

    public async Task<Result<PostDto>> Handle(UpdatePostCommand request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure<PostDto>(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure<PostDto>(Error.Unauthorized("You can only update your own posts"));

        post.Update(request.Description, request.MediaUrls, request.Visibility, request.Duration);

        // Handle publish transition
        if (request.Status == PostStatus.Published && post.Status != PostStatus.Published)
        {
            post.Publish();
            var delta = await _kruscore.RecalculateAsync(request.UserId, DateOnly.FromDateTime(post.CreatedAt));
            post.SetDeltaKruskor(delta);
        }

        await _repository.UpdateAsync(post);

        var ascents = post.Ascents.ToList();
        var grades = ascents.Select(a => a.Route?.Grade).Where(g => g is not null).ToList();
        var maxGrade = grades.Count > 0 ? grades.MaxBy(g => g!.Index) : null;
        var avgIndex = grades.Count > 0 ? (int)Math.Round(grades.Average(g => g!.Index)) : 0;
        var avgGrade = grades.Count > 0 ? grades.FirstOrDefault(g => g!.Index >= avgIndex)?.Raw ?? "" : "";

        return Result.Success(new PostDto
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
                TotalRoutes = ascents.Count,
                MaxGrade = maxGrade?.Raw,
            },
            Ascents = ascents.Adapt<List<AscentDto>>()
        });
    }
}
