namespace Cruxa.Application.Features.Statistics.DTOs;

public class ActivityDayDto
{
    public int Day { get; set; }
    public double Intensity { get; set; }
    public bool HasWorkout { get; set; }
    public int RouteCount { get; set; }
}
