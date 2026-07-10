namespace Cruxa.Application.Features.Admin.DTOs;

public class AdminGymItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public int RouteCount { get; set; }
    public int SetterCount { get; set; }
    public double Rating { get; set; }
    public int MonthlyAscents { get; set; }
    public string Status { get; set; } = "Active";
}
