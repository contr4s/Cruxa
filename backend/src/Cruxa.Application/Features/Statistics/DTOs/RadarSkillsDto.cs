namespace Cruxa.Application.Features.Statistics.DTOs;

public class RadarSkillItemDto
{
    public string Tag { get; set; } = string.Empty;
    public double Skill { get; set; }
}

public class RadarSkillsResponse
{
    public List<RadarSkillItemDto> Skills { get; set; } = [];
}
