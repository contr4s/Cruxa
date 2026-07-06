using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Queries;

public record GetFeedQuery : IRequest<Result<OffsetPaginatedList<PostDto>>>
{
    public Guid UserId { get; }
    public int Page { get; }
    public int PageSize { get; }

    public GetFeedQuery(Guid userId, int page = 1, int pageSize = 20)
    {
        UserId = userId;
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
    }
}
