namespace Cruxa.Application.Features.Gyms.DTOs;

using Domain.ValueObjects;

/// <summary>
/// DTO for importing a gym from an external source (parser).
/// Mirrors ParsedGym from the Parser project but lives in Application layer.
/// </summary>
public class ImportGymDto
{
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? Description { get; set; }
    public string? ContactInfo { get; set; }
    public string? ContactEmail { get; set; }
    public List<string>? SocialLinks { get; set; }
    public string? Website { get; set; }
    public List<PriceItem>? Prices { get; set; }
    public List<WorkingHoursEntry>? WorkingHours { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public double? WallArea { get; set; }
    public double? MaxHeight { get; set; }
    public int? YearFounded { get; set; }
    public List<string>? MetroStations { get; set; }
    public List<string>? Tags { get; set; }
}

/// <summary>
/// Result of a bulk import operation.
/// </summary>
public class BulkImportResult
{
    public int Imported { get; set; }
    public int Skipped { get; set; }
    public List<string> Errors { get; set; } = [];
}
