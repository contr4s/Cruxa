using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Application.Features.Statistics.Services;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetRadarSkillsHandler(KruscoreService kruscore)
    : IRequestHandler<GetRadarSkillsQuery, Result<RadarSkillsResponse>>
{
    public async Task<Result<RadarSkillsResponse>> Handle(GetRadarSkillsQuery request, CancellationToken ct)
    {
        var skills = await kruscore.GetRadarSkillsAsync(request.UserId);
        return new RadarSkillsResponse
        {
            Skills = skills
                .Select(kv => new RadarSkillItemDto { Tag = kv.Key, Skill = Math.Round(kv.Value, 1) })
                .ToList()
        };
    }
}
