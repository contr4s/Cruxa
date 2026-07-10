using Mapster;
using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.GymAdmin.Queries;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Handlers;

public sealed class GetAdminRoutesHandler(
    IRouteRepository routes)
    : IRequestHandler<GetAdminRoutesQuery, Result<OffsetPaginatedList<RouteDto>>>
{
    public async Task<Result<OffsetPaginatedList<RouteDto>>> Handle(GetAdminRoutesQuery request, CancellationToken ct)
    {
        request.Filter.GymId = request.GymId;

        var (items, totalCount) = await routes.GetFilteredRoutesAsync(request.Filter);
        var dtos = items.Select(RouteDto.FromEntity).ToList();

        return Result.Success(new OffsetPaginatedList<RouteDto>(dtos, totalCount, request.Filter.Page, request.Filter.PageSize));
    }
}
