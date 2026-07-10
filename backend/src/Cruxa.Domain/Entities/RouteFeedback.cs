namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;

/// <summary>
/// Обратная связь пользователя о трассе (оценка, отзыв, заметки, мнение о грейде).
/// Одна трасса может иметь много фидбеков (по одному от каждого пользователя).
/// </summary>
public class RouteFeedback : Entity<Guid>
{
    public Guid RouteId { get; private set; }
    public Guid UserId { get; private set; }

    /// <summary>Оценка трассы от 1 до 5 (насколько понравилась)</summary>
    public int? Rating { get; private set; }

    /// <summary>Мнение пользователя о грейде трассы (gradeIndex), null = не голосовал</summary>
    public int? GradeIndex { get; private set; }

    /// <summary>Приватные заметки (расклад трассы, ключевые движения — видно только себе)</summary>
    public string? PrivateNotes { get; private set; }

    /// <summary>Публичный отзыв о трассе (виден рутсеттерам и другим скалолазам)</summary>
    public string? PublicReview { get; private set; }

    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    // Navigation properties
    private readonly Route _route = null!;
    public Route Route => _route;

    private readonly User _user = null!;
    public User User => _user;

    private RouteFeedback() { }

    public static Result<RouteFeedback> Create(
        Guid routeId,
        Guid userId,
        int? rating = null,
        string? privateNotes = null,
        string? publicReview = null,
        int? gradeIndex = null)
    {
        Guard.AgainstDefault(routeId, nameof(routeId));
        Guard.AgainstDefault(userId, nameof(userId));

        if (rating.HasValue)
            Guard.AgainstOutOfRange(rating.Value, 1, 5, nameof(rating));

        return Result.Success(new RouteFeedback
        {
            Id = Guid.NewGuid(),
            RouteId = routeId,
            UserId = userId,
            Rating = rating,
            PrivateNotes = privateNotes,
            PublicReview = publicReview,
            GradeIndex = gradeIndex,
            CreatedAt = DateTime.UtcNow
        });
    }

    public void UpdateFeedback(int? rating, string? privateNotes, string? publicReview, int? gradeIndex)
    {
        if (rating.HasValue)
            Guard.AgainstOutOfRange(rating.Value, 1, 5, nameof(rating));

        Rating = rating;
        PrivateNotes = privateNotes;
        PublicReview = publicReview;
        GradeIndex = gradeIndex;
        UpdatedAt = DateTime.UtcNow;
    }
}
