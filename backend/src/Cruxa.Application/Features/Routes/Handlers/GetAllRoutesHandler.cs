using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetAllRoutesHandler(IRouteRepository routes) : IRequestHandler<GetAllRoutesQuery, Result<OffsetPaginatedList<RouteDto>>>
{
    public async Task<Result<OffsetPaginatedList<RouteDto>>> Handle(GetAllRoutesQuery q, CancellationToken ct)
    {
        var (items, totalCount) = await routes.GetAllPagedAsync(q.Page, q.PageSize);
        var dtos = items.Select(RouteDto.FromEntity).ToList();
        return Result.Success(new OffsetPaginatedList<RouteDto>(dtos, totalCount, q.Page, q.PageSize));
    }
}
