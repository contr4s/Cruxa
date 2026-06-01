namespace Cruxa.Domain.Entities;

/// <summary>
/// Социальная связь подписки между пользователями
/// </summary>
public class Follower
{
    public Guid FollowerId { get; set; }

    public Guid FolloweeId { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation properties

    public User FollowerUser { get; set; } = null!;

    public User FolloweeUser { get; set; } = null!;
}
