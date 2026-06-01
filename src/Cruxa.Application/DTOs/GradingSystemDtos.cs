namespace Cruxa.Application.DTOs;

/// <summary>
/// DTO для системы оценок
/// </summary>
public class GradingSystemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Dictionary<string, int> GradeMapping { get; set; } = new();
}
