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

    public CreatePostHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<PostDto>> Handle(CreatePostCommand request, CancellationToken ct)
    {
        var postResult = DomainPost.Create(request.UserId, request.GymId, request.Description, request.MediaUrls);
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

public sealed class UpdatePostHandler : IRequestHandler<UpdatePostCommand, Result<PostDto>>
{
    private readonly IPostRepository _repository;

    public UpdatePostHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<PostDto>> Handle(UpdatePostCommand request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure<PostDto>(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure<PostDto>(Error.Unauthorized("You can only update your own posts"));

        post.Update(request.Description, request.MediaUrls, request.Visibility);
        await _repository.UpdateAsync(post);

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

public sealed class PublishPostHandler : IRequestHandler<PublishPostCommand, Result>
{
    private readonly IPostRepository _repository;

    public PublishPostHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result> Handle(PublishPostCommand request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only publish your own posts"));

        post.Publish();
        await _repository.UpdateAsync(post);
        return Result.Success();
    }
}

public sealed class DeletePostHandler : IRequestHandler<DeletePostCommand, Result>
{
    private readonly IPostRepository _repository;

    public DeletePostHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeletePostCommand request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only delete your own posts"));

        await _repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
