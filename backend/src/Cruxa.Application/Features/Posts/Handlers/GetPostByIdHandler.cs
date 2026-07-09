using MediatR;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Social.Contracts;

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

    internal static PostDto MapToDto(Domain.Entities.Post post)
    {
        var ascents = post.Ascents.ToList();
        var totalRoutes = ascents.Count;
        var grades = ascents.Select(a => a.Route?.Grade).Where(g => g is not null).ToList();
        var maxGrade = grades.Count > 0 ? grades.MaxBy(g => g!.Index) : null;
        var avgIndex = grades.Count > 0 ? (int)Math.Round(grades.Average(g => g!.Index)) : 0;
        var avgGrade = grades.Count > 0 ? grades.FirstOrDefault(g => g!.Index >= avgIndex)?.Raw ?? "" : "";
        var totalKruskor = ascents.Sum(a => a.Route is not null
            ? (int)(Domain.Services.KruscoreCalculator.GetS(a.Style, a.Route.Type) * Domain.Services.KruscoreCalculator.GetScale(a.Style, a.Route.Type))
            : 0);

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
                TotalKruskor = totalKruskor,
                AvgGrade = avgGrade,
                Duration = post.Duration,
                TotalRoutes = totalRoutes,
                MaxGrade = maxGrade?.Raw,
            },
            Ascents = ascents.Select(a => new AscentDto
            {
                Id = a.Id,
                RouteId = a.RouteId,
                RouteName = a.Route?.Name ?? "",
                Grade = a.Route?.Grade?.Raw ?? "",
                GradeIndex = a.Route?.Grade?.Index ?? 0,
                HoldColor = a.Route?.HoldColor ?? default,
                Style = a.Style,
                MediaUrls = a.MediaUrls.ToList(),
                Tags = a.Route?.Tags.Select(t => new TagDto { Name = t.Value, Category = t.Category }).ToList() ?? [],
                CreatedAt = a.CreatedAt
            }).ToList()
        };
    }
}
