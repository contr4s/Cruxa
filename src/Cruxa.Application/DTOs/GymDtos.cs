namespace Cruxa.Application.DTOs;

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
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? ContactInfo { get; set; }
    public string? Website { get; set; }
    public string? Prices { get; set; }
    public string? WorkingHours { get; set; }
    public List<string> PhotoUrls { get; set; } = [];
    public Guid? GradingSystemId { get; set; }
    public bool IsParsed { get; set; }
}

/// <summary>
/// Запрос на создание/обновление скалодрома
/// </summary>
public class CreateGymRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? ContactInfo { get; set; }
    public string? Website { get; set; }
    public string? Prices { get; set; }
    public string? WorkingHours { get; set; }
    public List<string>? PhotoUrls { get; set; }
    public Guid? GradingSystemId { get; set; }
}
