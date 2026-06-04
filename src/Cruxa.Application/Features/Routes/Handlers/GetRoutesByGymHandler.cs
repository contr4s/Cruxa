using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetRoutesByGymHandler(IRouteRepository routes) : IRequestHandler<GetRoutesByGymQuery, Result<OffsetPaginatedList<RouteDto>>>
{
    public async Task<Result<OffsetPaginatedList<RouteDto>>> Handle(GetRoutesByGymQuery q, CancellationToken ct)
    {
        var result = await routes.GetByGymIdAsync(q.GymId);
        var dtos = result.Select(r => r.Adapt<RouteDto>()).ToList();
        var total = dtos.Count;
        var paged = dtos.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();
        return Result.Success(new OffsetPaginatedList<RouteDto>(paged, total, q.Page, q.PageSize));
    }
}
