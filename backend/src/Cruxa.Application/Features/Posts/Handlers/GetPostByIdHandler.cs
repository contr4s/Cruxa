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
        Ascents = post.Ascents.Select(a => new AscentDto
        {
            Id = a.Id,
            RouteId = a.RouteId,
            RouteName = a.Route?.Name ?? "",
            Grade = a.Route?.Grade?.Raw ?? "",
            GradeIndex = a.Route?.Grade?.Index ?? 0,
            HoldColor = a.Route?.HoldColor ?? default,
            Style = a.Style,
            MediaUrls = a.MediaUrls.ToList(),
            CreatedAt = a.CreatedAt
        }).ToList()
    };
}
