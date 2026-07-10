namespace Cruxa.Application.Features.GymAdmin.DTOs;

public class SetterManagementItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public int ActiveRoutes { get; set; }
    public double AverageRating { get; set; }
    public string? Email { get; set; }
}
