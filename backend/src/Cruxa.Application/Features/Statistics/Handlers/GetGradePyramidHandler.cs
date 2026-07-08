using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetGradePyramidHandler(IStatsRepository statsRepo)
    : IRequestHandler<GetGradePyramidQuery, Result<List<GradePyramidItemDto>>>
{
    public async Task<Result<List<GradePyramidItemDto>>> Handle(GetGradePyramidQuery request, CancellationToken ct)
    {
        var ascents = await statsRepo.GetAscentsWithRoutesAsync(request.UserId);
        var attempts = ascents.Where(a => a.Style == Domain.Enums.AscentStyle.Attempt).Select(a => a.RouteId).ToHashSet();

        return ascents
            .Where(a => !attempts.Contains(a.RouteId))
            .GroupBy(a => a.Route.Grade.Raw)
            .Select(g => new GradePyramidItemDto
            {
                Grade = g.Key,
                Count = g.Count(),
                GradeIndex = g.First().Route.Grade.Index
            })
            .OrderBy(x => x.GradeIndex)
            .ToList();
    }
}
