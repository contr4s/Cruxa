namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;

/// <summary>
/// Лайк на посте
/// </summary>
public class Like : Entity<Guid>
{
    public Guid PostId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation properties
    public Post Post { get; private set; } = null!;
    public User User { get; private set; } = null!;

    // For EF Core
    private Like() { }

    public static Result<Like> Create(Guid postId, Guid userId)
    {
        Guard.AgainstDefault(postId, nameof(postId));
        Guard.AgainstDefault(userId, nameof(userId));

        return Result.Success(new Like
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        });
    }
}
