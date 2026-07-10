using Mapster;
using MediatR;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routesetters.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routesetters.Handlers;

public sealed class GetSetterRoutesHandler(
    IRouteRepository routes,
    ICurrentUserService currentUser)
    : IRequestHandler<GetSetterRoutesQuery, Result<OffsetPaginatedList<RouteDto>>>
{
    public async Task<Result<OffsetPaginatedList<RouteDto>>> Handle(GetSetterRoutesQuery request, CancellationToken ct)
    {
        var userId = currentUser.GetRequiredUserId();
        request.Filter.AuthorId = userId;

        var (items, totalCount) = await routes.GetFilteredRoutesAsync(request.Filter);
        var dtos = items.Select(RouteDto.FromEntity).ToList();

        return Result.Success(new OffsetPaginatedList<RouteDto>(dtos, totalCount, request.Filter.Page, request.Filter.PageSize));
    }
}
