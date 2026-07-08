namespace Cruxa.Application.Features.Routes.DTOs;

using Domain.Enums;

/// <summary>
/// DTO для трассы
/// </summary>
public class RouteDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid GymId { get; set; }
    public string GymName { get; set; } = string.Empty;
    public Guid? AuthorId { get; set; }
    public string? SetterUsername { get; set; }
    public string? SetterName { get; set; }
    public string? SetterAvatarUrl { get; set; }
    public string GradeRaw { get; set; } = string.Empty;
    public int GradeIndex { get; set; }
    public RouteType Type { get; set; }
    public HoldColor HoldColor { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public List<string> Tags { get; set; } = [];
    public string? Sector { get; set; }
    public double Rating { get; set; }
    public int AscentsCount { get; set; }
    public bool IsActive { get; set; }
}
