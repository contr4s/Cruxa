using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class AddCommentHandler : IRequestHandler<AddCommentCommand, Result<CommentDto>>
{
    private readonly ICommentRepository _repository;

    public AddCommentHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<CommentDto>> Handle(AddCommentCommand request, CancellationToken ct)
    {
        var commentResult = Comment.Create(request.PostId, request.UserId, request.Content);
        if (commentResult.IsFailure)
            return Result.Failure<CommentDto>(commentResult.Error);

        var comment = commentResult.Value;
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
