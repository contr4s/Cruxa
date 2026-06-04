using MediatR;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;
using DomainPost = Cruxa.Domain.Entities.Post;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class CreatePostHandler : IRequestHandler<CreatePostCommand, Result<PostDto>>
{
    private readonly IPostRepository _repository;
    private readonly IUnitOfWork _uow;

    public CreatePostHandler(IPostRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

    public async Task<Result<PostDto>> Handle(CreatePostCommand request, CancellationToken ct)
    {
        var postResult = DomainPost.Create(request.UserId, request.GymId, request.Description, request.MediaUrls);
        if (postResult.IsFailure)
            return Result.Failure<PostDto>(postResult.Error);

        var post = postResult.Value;
        if (request.Visibility != default)
            post.Update(null, null, request.Visibility);

        await _repository.AddAsync(post);
        await _uow.SaveChangesAsync(ct);
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
