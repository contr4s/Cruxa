namespace Cruxa.Application.Features.Statistics.DTOs;

public class RadarSkillItemDto
{
    public string Name { get; set; } = string.Empty;
    public double Value { get; set; }
}

public class RadarSkillsResponse
{
    public Dictionary<string, List<RadarSkillItemDto>> Categories { get; set; } = [];
}
