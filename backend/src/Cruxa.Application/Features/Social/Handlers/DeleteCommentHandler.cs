using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Social.Handlers;

public sealed class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, Result>
{
    private readonly ICommentRepository _repository;

    public DeleteCommentHandler(ICommentRepository repository)
    {
        _repository = repository;
    }

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
