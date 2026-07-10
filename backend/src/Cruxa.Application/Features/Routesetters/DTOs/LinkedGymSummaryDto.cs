namespace Cruxa.Application.Features.Routesetters.DTOs;

public class LinkedGymSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? Address { get; set; }
    public int ActiveRouteCount { get; set; }
    public double Rating { get; set; }
}
