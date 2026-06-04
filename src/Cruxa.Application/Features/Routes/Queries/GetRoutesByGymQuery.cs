using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetRoutesByGymQuery : IRequest<Result<OffsetPaginatedList<RouteDto>>>
{
    public Guid GymId { get; }
    public int Page { get; }
    public int PageSize { get; }

    public GetRoutesByGymQuery(Guid gymId, int page = 1, int pageSize = 20)
    {
        GymId = gymId;
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
    }
}
