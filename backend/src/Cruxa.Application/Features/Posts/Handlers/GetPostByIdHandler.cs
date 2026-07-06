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
