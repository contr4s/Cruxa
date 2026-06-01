namespace Cruxa.Domain.Entities;

/// <summary>
/// Лайк на посте
/// </summary>
public class Like
{
    public Guid Id { get; set; }

    public Guid PostId { get; set; }

    public Guid UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation properties

    public Post Post { get; set; } = null!;

    public User User { get; set; } = null!;
}
