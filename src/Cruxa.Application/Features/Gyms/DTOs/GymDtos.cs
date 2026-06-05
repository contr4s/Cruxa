namespace Cruxa.Application.Features.Gyms.DTOs;

using Cruxa.Domain.ValueObjects;

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
    public string? ContactInfo { get; set; }
    public string? Website { get; set; }
    public List<PriceItem>? Prices { get; set; }
    public List<WorkingHoursEntry>? WorkingHours { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public Guid? GradingSystemId { get; set; }
    public double? WallArea { get; set; }
    public double? MaxHeight { get; set; }
    public int? YearFounded { get; set; }
    public List<string>? MetroStations { get; set; }
    public List<string>? Tags { get; set; }
    public bool IsParsed { get; set; }
}