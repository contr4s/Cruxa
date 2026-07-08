using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetGymStatsHandler(IStatsRepository stats)
    : IRequestHandler<GetGymStatsQuery, Result<GymStatsDto>>
{
    public async Task<Result<GymStatsDto>> Handle(GetGymStatsQuery request, CancellationToken ct)
    {
        var gym = await stats.GetGymWithRoutesAsync(request.GymId);
        if (gym is null)
            return Result.Failure<GymStatsDto>(Error.NotFound("Gym not found"));

        var activeRoutes = gym.Routes.Where(r => r.IsActive).ToList();
        var minGrade = activeRoutes.Count > 0 ? activeRoutes.Min(r => r.Grade.Index) : 0;
        var maxGrade = activeRoutes.Count > 0 ? activeRoutes.Max(r => r.Grade.Index) : 0;

        return new GymStatsDto
        {
            TotalRoutes = activeRoutes.Count,
            AvgRating = 0, // TODO: add when Reviews are included in GetGymWithRoutesAsync
            GradeRange = activeRoutes.Count > 0 ? $"{minGrade}–{maxGrade}" : null,
            WeeklyActivity = 0 // TODO: add when Ascent tracking is included
        };
    }
}
