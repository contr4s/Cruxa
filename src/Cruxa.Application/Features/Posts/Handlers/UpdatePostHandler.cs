using MediatR;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class UpdatePostHandler : IRequestHandler<UpdatePostCommand, Result<PostDto>>
{
    private readonly IPostRepository _repository;
    private readonly IUnitOfWork _uow;

    public UpdatePostHandler(IPostRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

    public async Task<Result<PostDto>> Handle(UpdatePostCommand request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure<PostDto>(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure<PostDto>(Error.Unauthorized("You can only update your own posts"));

        post.Update(request.Description, request.MediaUrls, request.Visibility);
        await _repository.UpdateAsync(post);
        await _uow.SaveChangesAsync(ct);

        return Result.Success(new PostDto
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
            CommentsCount = post.Comments.Count
        });
    }
}
