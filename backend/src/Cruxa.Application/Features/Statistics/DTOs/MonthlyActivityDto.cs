namespace Cruxa.Application.Features.Statistics.DTOs;

public class MonthlyActivityDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public List<int> Days { get; set; } = [];
    public int TotalWorkouts { get; set; }
    public int TotalRoutes { get; set; }
    public int Streak { get; set; }
}
