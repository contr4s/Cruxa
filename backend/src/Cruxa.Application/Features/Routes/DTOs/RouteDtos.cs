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
    public string? SetterGender { get; set; }
    public string GradeRaw { get; set; } = string.Empty;
    public int GradeIndex { get; set; }
    public string Grade { get; set; } = string.Empty;
    public RouteType Type { get; set; }
    public HoldColor HoldColor { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public List<string> Tags { get; set; } = [];
    public string? Sector { get; set; }
    public double Rating { get; set; }
    public int AscentsCount { get; set; }
    public bool IsActive { get; set; }
    public RouteStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public static RouteDto FromEntity(Domain.Entities.Route r) => new()
    {
        Id = r.Id,
        Name = r.Name,
        GymId = r.GymId,
        GymName = r.Gym?.Name ?? "",
        AuthorId = r.AuthorId,
        SetterUsername = r.Author?.Username,
        SetterName = r.Author is not null ? $"{r.Author.FirstName} {r.Author.LastName}".Trim() : null,
        SetterAvatarUrl = r.Author?.AvatarUrl,
        SetterGender = r.Author?.Gender switch { "M" => "male", "F" => "female", _ => null },
        GradeRaw = r.Grade.Raw,
        GradeIndex = r.Grade.Index,
        Grade = r.Grade.Raw,
        Type = r.Type,
        HoldColor = r.HoldColor,
        PhotoUrls = r.PhotoUrls.ToList(),
        Tags = r.Tags.Select(t => t.Value).ToList(),
        Sector = r.Sector,
        Rating = r.Feedbacks.Count > 0 ? r.Feedbacks.Average(f => f.Rating) ?? 0 : 0,
        AscentsCount = r.Ascents.Count,
        CreatedAt = r.CreatedAt,
        IsActive = r.IsActive,
        Status = r.IsActive ? RouteStatus.Active : RouteStatus.Archived,
    };
}
