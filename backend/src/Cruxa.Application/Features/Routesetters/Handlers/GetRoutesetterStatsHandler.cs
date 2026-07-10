using MediatR;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routesetters.DTOs;
using Cruxa.Application.Features.Routesetters.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routesetters.Handlers;

public sealed class GetRoutesetterStatsHandler(
    IRouteRepository routes,
    ICurrentUserService currentUser)
    : IRequestHandler<GetRoutesetterStatsQuery, Result<RoutesetterStatsDto>>
{
    public async Task<Result<RoutesetterStatsDto>> Handle(GetRoutesetterStatsQuery request, CancellationToken ct)
    {
        var userId = currentUser.GetRequiredUserId();

        var filter = new Routes.DTOs.RouteFilter
        {
            AuthorId = userId,
            PageSize = int.MaxValue,
        };

        var (items, _) = await routes.GetFilteredRoutesAsync(filter);

        var active = items.Where(r => r.IsActive).ToList();
        var totalAscents = items.Sum(r => r.Ascents.Count);
        var ratedRoutes = active.Where(r => r.Feedbacks.Any(f => f.Rating.HasValue)).ToList();
        var avgRating = ratedRoutes.Count > 0
            ? Math.Round(ratedRoutes.Average(r => r.Feedbacks.Where(f => f.Rating.HasValue).Average(f => f.Rating.Value)), 1)
            : 0;

        return Result.Success(new RoutesetterStatsDto
        {
            ActiveRoutes = active.Count,
            AverageRating = Math.Round(avgRating, 1),
            TotalAscents = totalAscents,
        });
    }
}
