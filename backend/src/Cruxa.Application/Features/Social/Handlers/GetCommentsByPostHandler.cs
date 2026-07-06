using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

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
