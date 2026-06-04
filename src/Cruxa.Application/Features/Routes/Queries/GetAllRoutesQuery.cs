using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetAllRoutesQuery : IRequest<Result<OffsetPaginatedList<RouteDto>>>
{
    public int Page { get; }
    public int PageSize { get; }

    public GetAllRoutesQuery(int page = 1, int pageSize = 20)
    {
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
    }
}
