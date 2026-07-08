namespace Cruxa.Application.Features.Posts.DTOs;

/// <summary>
/// Статистика тренировки (вычисляется из пролазов).
/// </summary>
public class PostStatsDto
{
    public double TotalKruskor { get; set; }
    public string AvgGrade { get; set; } = string.Empty;
    public int? Duration { get; set; }
    public int TotalRoutes { get; set; }
    public string? MaxGrade { get; set; }
}
