namespace Cruxa.Application.Features.Routesetters.DTOs;

public class RouteReviewSummaryDto
{
    public Guid Id { get; set; }
    public Guid RouteId { get; set; }
    public string RouteName { get; set; } = string.Empty;
    public string RouteGrade { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
    public string? UserAvatarUrl { get; set; }
    public double? Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
