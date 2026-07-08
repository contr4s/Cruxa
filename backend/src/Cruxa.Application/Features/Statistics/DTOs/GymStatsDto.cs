namespace Cruxa.Application.Features.Statistics.DTOs;

public class GymStatsDto
{
    public int TotalRoutes { get; set; }
    public double AvgRating { get; set; }
    public string? GradeRange { get; set; }
    public int WeeklyActivity { get; set; }
}
