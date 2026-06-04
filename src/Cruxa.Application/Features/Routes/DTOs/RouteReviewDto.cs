namespace Cruxa.Application.Features.Routes.DTOs;

/// <summary>
/// DTO для отзыва о трассе
/// </summary>
public class RouteReviewDto
{
    public Guid Id { get; set; }
    public Guid RouteId { get; set; }
    public Guid UserId { get; set; }
    public string? Username { get; set; }
    public int? Rating { get; set; }
    public string? PrivateNotes { get; set; }
    public string? PublicReview { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
