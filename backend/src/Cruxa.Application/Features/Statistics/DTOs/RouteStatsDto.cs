namespace Cruxa.Application.Features.Statistics.DTOs;

public class RouteStatsDto
{
    public int TotalAscents { get; set; }
    public double AvgRating { get; set; }
    public List<AscentDistributionDto> StyleDistribution { get; set; } = [];
}
