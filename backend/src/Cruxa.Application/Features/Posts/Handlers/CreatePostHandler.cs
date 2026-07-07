using MediatR;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using DomainPost = Cruxa.Domain.Entities.Post;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class CreatePostHandler : IRequestHandler<CreatePostCommand, Result<PostDto>>
{
    private readonly IPostRepository _repository;

    public CreatePostHandler(IPostRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PostDto>> Handle(CreatePostCommand request, CancellationToken ct)
    {
        var postResult = DomainPost.Create(request.UserId, request.GymId, request.Description, request.MediaUrls, request.Duration);
        if (postResult.IsFailure)
            return Result.Failure<PostDto>(postResult.Error);

        var post = postResult.Value;
        if (request.Visibility != default)
            post.Update(null, null, request.Visibility);

        await _repository.AddAsync(post);
        return Result.Success(MapToDto(post));
    }

    private static PostDto MapToDto(DomainPost post) => new()
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
