namespace Cruxa.Application.Features.Ascents.DTOs;

using Domain.Enums;

/// <summary>
/// DTO для пролаза
/// </summary>
public class AscentDto
{
    public Guid Id { get; set; }
    public Guid RouteId { get; set; }
    public string RouteName { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public int GradeIndex { get; set; }
    public HoldColor HoldColor { get; set; }
    public AscentStyle Style { get; set; }
    public List<string> MediaUrls { get; set; } = [];
    public List<TagDto> Tags { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}

public class TagDto
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
}