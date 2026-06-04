using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, Result>
{
    private readonly ICommentRepository _repository;
    private readonly IUnitOfWork _uow;

    public DeleteCommentHandler(ICommentRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

    public async Task<Result> Handle(DeleteCommentCommand request, CancellationToken ct)
    {
        var comment = await _repository.GetByIdAsync(request.CommentId);
        if (comment is null)
            return Result.Failure(Error.NotFound("Comment not found"));

        if (comment.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only delete your own comments"));

        await _repository.DeleteAsync(request.CommentId);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
