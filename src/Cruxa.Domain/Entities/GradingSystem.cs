namespace Cruxa.Domain.Entities;

/// <summary>
/// Система оценок/грейдов
/// </summary>
public class GradingSystem
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Маппинг "Отображаемое название (GradeRaw)" -> "Индекс сложности (GradeIndex)".
    /// JSONB в БД. Пример: { "6A": 400, "Красная": 650 }
    /// </summary>
    public string GradeMapping { get; set; } = "{}";

    // Navigation properties
    public ICollection<Gym> Gyms { get; set; } = [];
}
