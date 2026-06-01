namespace Cruxa.Application.DTOs;

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
    public int? Rating { get; set; }
    public List<string> MediaUrls { get; set; } = [];
    public string? PublicReview { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Запрос на создание пролаза
/// </summary>
public class CreateAscentRequest
{
    public Guid PostId { get; set; }
    public Guid RouteId { get; set; }
    public AscentStyle Style { get; set; }
    public int? Rating { get; set; }
    public List<string>? MediaUrls { get; set; }
    public string? PrivateNotes { get; set; }
    public string? PublicReview { get; set; }
}
