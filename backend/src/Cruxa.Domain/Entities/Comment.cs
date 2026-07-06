namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;

/// <summary>
/// Комментарий к посту
/// </summary>
public class Comment : Entity<Guid>
{
    public Guid PostId { get; private set; }
    public Guid UserId { get; private set; }
    public string Content { get; private set; } = null!;
    public DateTime CreatedAt { get; private set; }

    // Navigation properties
    public Post Post { get; private set; } = null!;
    public User User { get; private set; } = null!;

    // For EF Core
    private Comment() { }

    public static Result<Comment> Create(Guid postId, Guid userId, string content)
    {
        Guard.AgainstDefault(postId, nameof(postId));
        Guard.AgainstDefault(userId, nameof(userId));
        Guard.AgainstNullOrWhiteSpace(content, nameof(content));

        return Result.Success(new Comment
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId,
            Content = content,
            CreatedAt = DateTime.UtcNow
        });
    }
}
