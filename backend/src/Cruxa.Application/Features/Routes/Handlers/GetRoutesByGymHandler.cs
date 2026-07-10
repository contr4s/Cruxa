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
        var (items, totalCount) = await routes.GetFilteredRoutesAsync(q.Filter);
        var dtos = items.Select(RouteDto.FromEntity).ToList();
        return Result.Success(new OffsetPaginatedList<RouteDto>(dtos, totalCount, q.Filter.Page, q.Filter.PageSize));
    }
}
