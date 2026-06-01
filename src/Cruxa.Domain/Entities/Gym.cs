namespace Cruxa.Domain.Entities;

using Cruxa.Domain.Enums;

/// <summary>
/// Скалодром
/// </summary>
public class Gym
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string City { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public string? ContactInfo { get; set; }

    public string? Website { get; set; }

    /// <summary>
    /// Информация о ценах (JSONB)
    /// </summary>
    public string? Prices { get; set; }

    /// <summary>
    /// Часы работы (JSONB)
    /// </summary>
    public string? WorkingHours { get; set; }

    /// <summary>
    /// Список ссылок на фотографии (text[])
    /// </summary>
    public List<string> PhotoUrls { get; set; } = [];

    public Guid? GradingSystemId { get; set; }

    public bool IsParsed { get; set; }

    // Navigation properties

    public GradingSystem? GradingSystem { get; set; }

    public ICollection<Route> Routes { get; set; } = [];

    public ICollection<Post> Posts { get; set; } = [];
}
