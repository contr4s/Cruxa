namespace Cruxa.Application.Features.Statistics.DTOs;

public class MonthlyActivityDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public List<ActivityDayDto> Days { get; set; } = [];
    public int WeekActivity { get; set; }
}
