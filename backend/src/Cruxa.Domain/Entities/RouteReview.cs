namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;

/// <summary>
/// Отзыв пользователя о трассе (Rating + PublicReview + PrivateNotes).
/// Одна трасса может иметь много отзывов (по одному от каждого пользователя).
/// </summary>
public class RouteReview : Entity<Guid>
{
    public Guid RouteId { get; private set; }
    public Guid UserId { get; private set; }

    /// <summary>Оценка трассы от 1 до 5 (насколько понравилась)</summary>
    public int? Rating { get; private set; }

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

    private RouteReview() { }

    public static Result<RouteReview> Create(
        Guid routeId,
        Guid userId,
        int? rating = null,
        string? privateNotes = null,
        string? publicReview = null)
    {
        Guard.AgainstDefault(routeId, nameof(routeId));
        Guard.AgainstDefault(userId, nameof(userId));

        if (rating.HasValue)
            Guard.AgainstOutOfRange(rating.Value, 1, 5, nameof(rating));

        return Result.Success(new RouteReview
        {
            Id = Guid.NewGuid(),
            RouteId = routeId,
            UserId = userId,
            Rating = rating,
            PrivateNotes = privateNotes,
            PublicReview = publicReview,
            CreatedAt = DateTime.UtcNow
        });
    }

    public void UpdateReview(int? rating, string? privateNotes, string? publicReview)
    {
        if (rating.HasValue)
            Guard.AgainstOutOfRange(rating.Value, 1, 5, nameof(rating));

        Rating = rating;
        PrivateNotes = privateNotes;
        PublicReview = publicReview;
        UpdatedAt = DateTime.UtcNow;
    }
}
