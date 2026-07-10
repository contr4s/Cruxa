using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetRouteStatsHandler(IStatsRepository stats)
    : IRequestHandler<GetRouteStatsQuery, Result<RouteStatsDto>>
{
    public async Task<Result<RouteStatsDto>> Handle(GetRouteStatsQuery request, CancellationToken ct)
    {
        var route = await stats.GetRouteWithAscentsAndReviewsAsync(request.RouteId);
        if (route is null)
            return Result.Failure<RouteStatsDto>(Error.NotFound("Route not found"));

        var avgRating = route.Feedbacks.Count > 0
            ? route.Feedbacks.Average(f => f.Rating ?? 0)
            : 0;

        var styleDist = route.Ascents
            .GroupBy(a => a.Style)
            .Select(g => new AscentDistributionDto
            {
                Type = g.Key.ToString(),
                Count = g.Count()
            })
            .ToList();

        return new RouteStatsDto
        {
            TotalAscents = route.Ascents.Count,
            AvgRating = Math.Round(avgRating, 1),
            StyleDistribution = styleDist
        };
    }
}
