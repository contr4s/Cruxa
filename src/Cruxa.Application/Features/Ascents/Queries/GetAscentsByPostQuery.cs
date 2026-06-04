using MediatR;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Ascents.Queries;

public record GetAscentsByPostQuery : IRequest<Result<OffsetPaginatedList<AscentDto>>>
{
    public Guid PostId { get; }
    public int Page { get; }
    public int PageSize { get; }

    public GetAscentsByPostQuery(Guid postId, int page = 1, int pageSize = 20)
    {
        PostId = postId;
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
    }
}
