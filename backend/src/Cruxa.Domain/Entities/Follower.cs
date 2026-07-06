namespace Cruxa.Domain.Entities;

using Common;

/// <summary>
/// Социальная связь подписки между пользователями
/// </summary>
public class Follower
{
    public Guid FollowerId { get; private set; }
    public Guid FolloweeId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation properties
    public User FollowerUser { get; private set; } = null!;
    public User FolloweeUser { get; private set; } = null!;

    // For EF Core
    private Follower() { }

    public static Result<Follower> Create(Guid followerId, Guid followeeId)
    {
        Guard.AgainstDefault(followerId, nameof(followerId));
        Guard.AgainstDefault(followeeId, nameof(followeeId));

        return Result.Success(new Follower
        {
            FollowerId = followerId,
            FolloweeId = followeeId,
            CreatedAt = DateTime.UtcNow
        });
    }
}
