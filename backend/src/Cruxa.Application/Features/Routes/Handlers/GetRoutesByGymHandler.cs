using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetRoutesByGymHandler(IRouteRepository routes) : IRequestHandler<GetRoutesByGymQuery, Result<OffsetPaginatedList<RouteDto>>>
{
    public async Task<Result<OffsetPaginatedList<RouteDto>>> Handle(GetRoutesByGymQuery q, CancellationToken ct)
    {
        var (items, totalCount) = await routes.GetByGymPagedAsync(q.GymId, q.Page, q.PageSize);
        var dtos = items.Select(r => r.Adapt<RouteDto>()).ToList();
        return Result.Success(new OffsetPaginatedList<RouteDto>(dtos, totalCount, q.Page, q.PageSize));
    }
}
