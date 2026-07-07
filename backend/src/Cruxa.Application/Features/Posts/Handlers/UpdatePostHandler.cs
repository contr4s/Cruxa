using MediatR;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class UpdatePostHandler : IRequestHandler<UpdatePostCommand, Result<PostDto>>
{
    private readonly IPostRepository _repository;

    public UpdatePostHandler(IPostRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<PostDto>> Handle(UpdatePostCommand request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure<PostDto>(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure<PostDto>(Error.Unauthorized("You can only update your own posts"));

        post.Update(request.Description, request.MediaUrls, request.Visibility, request.Duration);
        await _repository.UpdateAsync(post);

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
            IsLiked = false
        });
    }
}
