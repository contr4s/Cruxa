namespace Cruxa.Domain.Entities;

/// <summary>
/// Комментарий к посту
/// </summary>
public class Comment
{
    public Guid Id { get; set; }

    public Guid PostId { get; set; }

    public Guid UserId { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    // Navigation properties

    public Post Post { get; set; } = null!;

    public User User { get; set; } = null!;
}
