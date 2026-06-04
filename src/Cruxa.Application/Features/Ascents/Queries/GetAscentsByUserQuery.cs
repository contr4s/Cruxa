using MediatR;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Ascents.Queries;

public record GetAscentsByUserQuery : IRequest<Result<OffsetPaginatedList<AscentDto>>>
{
    public Guid UserId { get; }
    public int Page { get; }
    public int PageSize { get; }

    public GetAscentsByUserQuery(Guid userId, int page = 1, int pageSize = 20)
    {
        UserId = userId;
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
    }
}
