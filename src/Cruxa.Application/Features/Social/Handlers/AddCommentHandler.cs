using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;
using DomainComment = Cruxa.Domain.Entities.Comment;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class AddCommentHandler : IRequestHandler<AddCommentCommand, Result<CommentDto>>
{
    private readonly ICommentRepository _repository;
    private readonly IUnitOfWork _uow;

    public AddCommentHandler(ICommentRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

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
        await _uow.SaveChangesAsync(ct);
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
