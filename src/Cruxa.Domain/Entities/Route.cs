namespace Cruxa.Domain.Entities;

using Enums;

/// <summary>
/// Трасса на скалодроме
/// </summary>
public class Route
{
    public Guid Id { get; set; }

    public Guid GymId { get; set; }

    public Guid? AuthorId { get; set; }

    /// <summary>
    /// Оригинальная сложность от админа (выбирается из справочника GradingSystem)
    /// </summary>
    public string GradeRaw { get; set; } = string.Empty;

    /// <summary>
    /// Нормализованная средняя сложность (0 - 1000) для статистики
    /// </summary>
    public int GradeIndex { get; set; }

    public RouteType Type { get; set; }

    public HoldColor HoldColor { get; set; }

    /// <summary>
    /// Фотографии трассы
    /// </summary>
    public List<string> PhotoUrls { get; set; } = [];

    /// <summary>
    /// Теги стиля трассы (text[])
    /// </summary>
    public List<string> Tags { get; set; } = [];

    /// <summary>
    /// Название зоны на скалодроме или расположение
    /// </summary>
    public string? Sector { get; set; }

    /// <summary>
    /// Активна ли трасса (не скручена)
    /// </summary>
    public bool IsActive { get; set; } = true;

    // Navigation properties

    public Gym Gym { get; set; } = null!;

    public User? Author { get; set; }

    public ICollection<Ascent> Ascents { get; set; } = [];
}
