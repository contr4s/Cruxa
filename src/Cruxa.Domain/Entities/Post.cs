namespace Cruxa.Domain.Entities;

using Enums;

/// <summary>
/// Пост-тренировка (отчет о посещении скалодрома)
/// </summary>
public class Post
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid GymId { get; set; }

    /// <summary>
    /// Текст поста, впечатления о тренировке
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Список ссылок на фото/видео с тренировки
    /// </summary>
    public List<string> MediaUrls { get; set; } = [];

    public PostVisibility Visibility { get; set; } = PostVisibility.Public;

    public PostStatus Status { get; set; } = PostStatus.Draft;

    public DateTime CreatedAt { get; set; }

    // Navigation properties

    public User User { get; set; } = null!;

    public Gym Gym { get; set; } = null!;

    public ICollection<Ascent> Ascents { get; set; } = [];

    public ICollection<Like> Likes { get; set; } = [];

    public ICollection<Comment> Comments { get; set; } = [];
}
