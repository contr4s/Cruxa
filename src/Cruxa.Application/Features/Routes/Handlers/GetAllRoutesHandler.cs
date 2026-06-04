using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetAllRoutesHandler(IRouteRepository routes) : IRequestHandler<GetAllRoutesQuery, Result<OffsetPaginatedList<RouteDto>>>
{
    public async Task<Result<OffsetPaginatedList<RouteDto>>> Handle(GetAllRoutesQuery q, CancellationToken ct)
    {
        var result = await routes.GetAllAsync();
        var dtos = result.Select(r => r.Adapt<RouteDto>()).ToList();
        var total = dtos.Count;
        var paged = dtos.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();
        return Result.Success(new OffsetPaginatedList<RouteDto>(paged, total, q.Page, q.PageSize));
    }
}
