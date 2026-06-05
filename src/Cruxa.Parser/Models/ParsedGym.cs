namespace Cruxa.Parser.Models;

using Cruxa.Domain.ValueObjects;

/// <summary>
/// Normalized DTO representing a gym parsed from climbingpro.ru.
/// Ready to be serialized to JSON or sent to the import API endpoint.
/// </summary>
public class ParsedGym
{
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? Description { get; set; }
    public string? ContactInfo { get; set; }
    public string? ContactEmail { get; set; }
    public List<string> SocialLinks { get; set; } = [];
    public string? Website { get; set; }
    public List<WorkingHoursEntry>? WorkingHours { get; set; }
    public List<PriceItem> Prices { get; set; } = [];
    public List<string> PhotoUrls { get; set; } = [];
    public double? WallArea { get; set; }
    public double? MaxHeight { get; set; }
    public int? YearFounded { get; set; }
    public List<string> MetroStations { get; set; } = [];
    public List<string> Tags { get; set; } = [];
}
