namespace Cruxa.Application.Features.Admin.DTOs;

public class RecentActivityItemDto
{
    public Guid? GymId { get; set; }
    public string? GymName { get; set; }
    public string Event { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsOnline { get; set; }
}
