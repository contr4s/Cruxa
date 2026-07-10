namespace Cruxa.Application.Features.GymAdmin.DTOs;

public class GymActivityDto
{
    public int NewRoutes { get; set; }
    public int Ascents { get; set; }
    public int Reviews { get; set; }
    public int Visitors { get; set; }
    public string Period { get; set; } = "30 дней";
}
