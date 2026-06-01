namespace Cruxa.Domain.Entities;

using Enums;

/// <summary>
/// Пользователь системы
/// </summary>
public class User
{
    public Guid Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? AvatarUrl { get; set; }

    public string? City { get; set; }

    public Role Role { get; set; } = Role.Climber;

    public DateTime CreatedAt { get; set; }

    // Navigation properties

    public ICollection<Post> Posts { get; set; } = [];

    public ICollection<Ascent> Ascents { get; set; } = [];

    public ICollection<Follower> Followers { get; set; } = [];

    public ICollection<Follower> Following { get; set; } = [];

    public ICollection<Like> Likes { get; set; } = [];

    public ICollection<Comment> Comments { get; set; } = [];
}
