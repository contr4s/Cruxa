using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Application.Features.Statistics.Services;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetRadarSkillsHandler(KruscoreService kruscore, IStatsRepository statsRepo)
    : IRequestHandler<GetRadarSkillsQuery, Result<RadarSkillsResponse>>
{
    public async Task<Result<RadarSkillsResponse>> Handle(GetRadarSkillsQuery request, CancellationToken ct)
    {
        var skills = await kruscore.GetRadarSkillsAsync(request.UserId);
        var ascentsWithTags = await statsRepo.GetAscentsWithTagsAsync(request.UserId);

        var tagCategory = new Dictionary<string, string>();
        foreach (var a in ascentsWithTags)
        {
            foreach (var (value, category) in a.Tags)
            {
                if (!tagCategory.ContainsKey(value))
                    tagCategory[value] = category ?? "general";
            }
        }

        var categories = new Dictionary<string, List<RadarSkillItemDto>>();
        foreach (var (tag, rawScore) in skills)
        {
            var cat = tagCategory.GetValueOrDefault(tag, "general");
            if (!categories.ContainsKey(cat))
                categories[cat] = [];
            categories[cat].Add(new RadarSkillItemDto
            {
                Name = tag,
                Value = Math.Round(rawScore, 1)
            });
        }

        return new RadarSkillsResponse { Categories = categories };
    }
}
