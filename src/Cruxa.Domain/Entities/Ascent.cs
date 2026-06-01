namespace Cruxa.Domain.Entities;

using Enums;

/// <summary>
/// Пролаз / Отметка о прохождении трассы
/// </summary>
public class Ascent
{
    public Guid Id { get; set; }

    public Guid PostId { get; set; }

    public Guid UserId { get; set; }

    public Guid RouteId { get; set; }

    public AscentStyle Style { get; set; }

    /// <summary>
    /// Оценка трассы пользователем от 1 до 5
    /// </summary>
    public int? Rating { get; set; }

    /// <summary>
    /// Фото/видео конкретного пролаза
    /// </summary>
    public List<string> MediaUrls { get; set; } = [];

    /// <summary>
    /// Приватные заметки чисто для себя
    /// </summary>
    public string? PrivateNotes { get; set; }

    /// <summary>
    /// Публичный отзыв о трассе
    /// </summary>
    public string? PublicReview { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation properties

    public Post Post { get; set; } = null!;

    public User User { get; set; } = null!;

    public Route Route { get; set; } = null!;
}
