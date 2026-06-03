using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;
using DomainComment = Cruxa.Domain.Entities.Comment;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class AddCommentHandler : IRequestHandler<AddCommentCommand, Result<CommentDto>>
{
    private readonly ICommentRepository _repository;

    public AddCommentHandler(ICommentRepository repository) => _repository = repository;

    public async Task<Result<CommentDto>> Handle(AddCommentCommand request, CancellationToken ct)
    {
        var comment = new DomainComment
        {
            Id = Guid.NewGuid(),
            PostId = request.PostId,
            UserId = request.UserId,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(comment);
        return Result.Success(new CommentDto
        {
            Id = comment.Id,
            PostId = comment.PostId,
            UserId = comment.UserId,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        });
    }
}

public sealed class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, Result>
{
    private readonly ICommentRepository _repository;

    public DeleteCommentHandler(ICommentRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteCommentCommand request, CancellationToken ct)
    {
        var comment = await _repository.GetByIdAsync(request.CommentId);
        if (comment is null)
            return Result.Failure(Error.NotFound("Comment not found"));

        if (comment.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only delete your own comments"));

        await _repository.DeleteAsync(request.CommentId);
        return Result.Success();
    }
}

public sealed class GetCommentsByPostHandler : IRequestHandler<GetCommentsByPostQuery, Result<IEnumerable<CommentDto>>>
{
    private readonly ICommentRepository _repository;

    public GetCommentsByPostHandler(ICommentRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<CommentDto>>> Handle(GetCommentsByPostQuery request, CancellationToken ct)
    {
        var comments = await _repository.GetByPostIdAsync(request.PostId);
        var dtos = comments.Select(c => new CommentDto
        {
            Id = c.Id,
            PostId = c.PostId,
            UserId = c.UserId,
            Username = c.User?.Username ?? "",
            Content = c.Content,
            CreatedAt = c.CreatedAt
        });
        return Result.Success(dtos);
    }
}
