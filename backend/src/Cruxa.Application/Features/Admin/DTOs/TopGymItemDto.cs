namespace Cruxa.Application.Features.Admin.DTOs;

public class TopGymItemDto
{
    public Guid GymId { get; set; }
    public string GymName { get; set; } = string.Empty;
    public int AscentsCount { get; set; }
}
