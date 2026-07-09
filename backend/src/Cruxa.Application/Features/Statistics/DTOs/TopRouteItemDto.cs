namespace Cruxa.Application.Features.Statistics.DTOs;

public class TopRouteItemDto
{
    public Guid Id => RouteId;
    public Guid AscentId { get; set; }
    public Guid RouteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string HoldColor { get; set; } = string.Empty;
    public string AscentType { get; set; } = string.Empty;
    public string GymName { get; set; } = string.Empty;
    public Guid GymId { get; set; }
    public double? Rating { get; set; }
    public DateTime Date { get; set; }
}
