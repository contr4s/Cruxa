using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetTopRoutesHandler(IStatsRepository statsRepo)
    : IRequestHandler<GetTopRoutesQuery, Result<List<TopRouteItemDto>>>
{
    public async Task<Result<List<TopRouteItemDto>>> Handle(GetTopRoutesQuery request, CancellationToken ct)
    {
        var ascents = await statsRepo.GetTopAscentsAsync(request.UserId);
        return ascents.Select(a => new TopRouteItemDto
        {
            AscentId = a.Id,
            RouteId = a.RouteId,
            Name = a.Route.Name,
            Grade = a.Route.Grade.Raw,
            HoldColor = a.Route.HoldColor.ToString(),
            AscentType = a.Style.ToString(),
            GymName = a.Route.Gym.Name,
            GymId = a.Route.GymId,
            Rating = a.Route.Reviews.Count > 0 ? a.Route.Reviews.Average(r => (double?)r.Rating) : 0,
            Date = a.CreatedAt
        }).ToList();
    }
}
