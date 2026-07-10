using MediatR;
using Cruxa.Application.Features.GymAdmin.DTOs;
using Cruxa.Application.Features.GymAdmin.Queries;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Handlers;

public sealed class GetGymAdminStatsHandler(
    IRouteRepository routes,
    IStatsRepository stats)
    : IRequestHandler<GetGymAdminStatsQuery, Result<GymAdminStatsDto>>
{
    public async Task<Result<GymAdminStatsDto>> Handle(GetGymAdminStatsQuery request, CancellationToken ct)
    {
        var gym = await stats.GetGymWithRoutesAsync(request.GymId);
        if (gym is null)
            return Result.Failure<GymAdminStatsDto>(Error.NotFound("Gym not found"));

        var active = gym.Routes.Where(r => r.IsActive).ToList();
        var totalAscents = gym.Routes.Sum(r => r.Ascents.Count);
        var ratedRoutes = active.Where(r => r.Feedbacks.Any(f => f.Rating.HasValue)).ToList();
        var avgRating = ratedRoutes.Count > 0
            ? Math.Round(ratedRoutes.Average(r => r.Feedbacks.Where(f => f.Rating.HasValue).Average(f => f.Rating.Value)), 1)
            : 0;

        return Result.Success(new GymAdminStatsDto
        {
            TotalRoutes = gym.Routes.Count,
            ActiveRoutes = active.Count,
            AverageRating = avgRating,
            TotalAscents = totalAscents,
        });
    }
}
