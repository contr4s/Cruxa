using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Queries;

using Cruxa.Domain.Enums;

public record GetFeedQuery : IRequest<Result<OffsetPaginatedList<PostDto>>>
{
    public Guid UserId { get; }
    public int Page { get; }
    public int PageSize { get; }
    public FeedFilter? Filter { get; }

    public GetFeedQuery(Guid userId, int page = 1, int pageSize = 20, FeedFilter? filter = null)
    {
        UserId = userId;
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
        Filter = filter;
    }
}
