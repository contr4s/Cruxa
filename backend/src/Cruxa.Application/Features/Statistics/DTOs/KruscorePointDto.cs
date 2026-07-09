namespace Cruxa.Application.Features.Statistics.DTOs;

public class KruscorePointDto
{
    public DateOnly Date { get; set; }
    public double Score { get; set; }
    public string? MaxGrade { get; set; }
}
