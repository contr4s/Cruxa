using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class GetCommentsByPostHandler : IRequestHandler<GetCommentsByPostQuery, Result<OffsetPaginatedList<CommentDto>>>
{
    private readonly ICommentRepository _repository;

    public GetCommentsByPostHandler(ICommentRepository repository) => _repository = repository;

    public async Task<Result<OffsetPaginatedList<CommentDto>>> Handle(GetCommentsByPostQuery request, CancellationToken ct)
    {
        var (items, totalCount) = await _repository.GetPagedByPostIdAsync(request.PostId, request.Page, request.PageSize);
        var dtos = items.Select(c => new CommentDto
        {
            Id = c.Id,
            PostId = c.PostId,
            UserId = c.UserId,
            Username = c.User?.Username ?? "",
            DisplayName = c.User is not null ? $"{c.User.FirstName} {c.User.LastName}".Trim() : "",
            UserAvatarUrl = c.User?.AvatarUrl,
            Content = c.Content,
            CreatedAt = c.CreatedAt
        }).ToList();
        return Result.Success(new OffsetPaginatedList<CommentDto>(dtos, totalCount, request.Page, request.PageSize));
    }
}
