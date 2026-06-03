namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;
using Enums;
using Events;
using ValueObjects;

/// <summary>
/// Пользователь системы (Aggregate Root)
/// </summary>
public class User : AggregateRoot<Guid>
{
    public string Username { get; private set; }
    public Email Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string? AvatarUrl { get; private set; }
    public string? City { get; private set; }
    public Role Role { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation properties
    private readonly List<Post> _posts = [];
    public IReadOnlyCollection<Post> Posts => _posts.AsReadOnly();

    private readonly List<Ascent> _ascents = [];
    public IReadOnlyCollection<Ascent> Ascents => _ascents.AsReadOnly();

    private readonly List<Follower> _followers = [];
    public IReadOnlyCollection<Follower> Followers => _followers.AsReadOnly();
    private readonly List<Follower> _following = [];
    public IReadOnlyCollection<Follower> Following => _following.AsReadOnly();

    private readonly List<Like> _likes = [];
    public IReadOnlyCollection<Like> Likes => _likes.AsReadOnly();

    private readonly List<Comment> _comments = [];
    public IReadOnlyCollection<Comment> Comments => _comments.AsReadOnly();

    private readonly List<RouteReview> _reviews = [];
    public IReadOnlyCollection<RouteReview> Reviews => _reviews.AsReadOnly();

    // For EF Core
    private User() { }

    public static Result<User> Create(Email email, string username, string passwordHash)
    {
        Guard.AgainstNullOrWhiteSpace(username, nameof(username));

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Username = username.Trim(),
            PasswordHash = passwordHash,
            Role = Role.Climber,
            CreatedAt = DateTime.UtcNow
        };

        user.AddDomainEvent(new UserRegisteredEvent(user.Id, user.Email.Value));

        return Result.Success(user);
    }

    public Result ChangePassword(string currentPasswordHash, string newPasswordHash)
    {
        Guard.AgainstNullOrWhiteSpace(currentPasswordHash, nameof(currentPasswordHash));
        Guard.AgainstNullOrWhiteSpace(newPasswordHash, nameof(newPasswordHash));

        if (currentPasswordHash != PasswordHash)
            return Result.Failure(Error.Validation("Current password is incorrect"));

        PasswordHash = newPasswordHash;
        return Result.Success();
    }

    public void UpdateProfile(string? avatarUrl, string? city)
    {
        if (avatarUrl is not null) AvatarUrl = avatarUrl;
        if (city is not null) City = city;
    }

    public void ChangeRole(Role newRole)
    {
        Role = newRole;
    }
}
