namespace Cruxa.Application.Features.Statistics.DTOs;

public class GradePyramidItemDto
{
    public string Grade { get; set; } = string.Empty;
    public int GradeIndex { get; set; }
    public int Count { get; set; }
}
