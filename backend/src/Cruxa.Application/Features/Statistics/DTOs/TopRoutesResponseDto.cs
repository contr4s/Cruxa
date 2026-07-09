namespace Cruxa.Application.Features.Statistics.DTOs;

public class TopRoutesResponseDto
{
    public List<TopRouteItemDto> Routes { get; set; } = [];
    public int TotalRoutes { get; set; }
    public string AvgGrade { get; set; } = "";
    public string MaxGrade { get; set; } = "";
}
