namespace Cruxa.Application.Features.Ascents.DTOs;

using Domain.Enums;

/// <summary>
/// DTO для пролаза
/// </summary>
public class AscentDto
{
    public Guid Id { get; set; }
    public Guid RouteId { get; set; }
    public string GradeRaw { get; set; } = string.Empty;
    public AscentStyle Style { get; set; }
    public List<string> MediaUrls { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}