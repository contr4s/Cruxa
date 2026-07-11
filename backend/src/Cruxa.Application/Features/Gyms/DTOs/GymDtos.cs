namespace Cruxa.Application.Features.Gyms.DTOs;

using System.Text.Json.Serialization;
using Domain.ValueObjects;

/// <summary>
/// DTO для скалодрома
/// </summary>
public class GymDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public List<string>? SocialLinks { get; set; }
    public string? ContactInfo { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public double? WallArea { get; set; }
    public double? MaxHeight { get; set; }
    public int? YearFounded { get; set; }
    public List<string>? MetroStations { get; set; }
    public List<string>? Tags { get; set; }
    public List<PriceItem>? Prices { get; set; }
    [JsonPropertyName("hours")]
    public List<WorkingHoursEntry>? WorkingHours { get; set; }
    public Guid? GradingSystemId { get; set; }
    public bool IsParsed { get; set; }
    public double Rating { get; set; }
    public int RouteCount { get; set; }
    public int ActiveRouteCount { get; set; }
    public bool IsFavorite { get; set; }
    public double? Distance { get; set; }
}