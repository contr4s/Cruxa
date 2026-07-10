namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;
using Enums;
using ValueObjects;

/// <summary>
/// Пользователь системы (Aggregate Root)
/// </summary>
public class User : AggregateRoot<Guid>
{
    public string Username { get; private set; }
    public Email Email { get; private set; }
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public string? AvatarUrl { get; private set; }
    public string? City { get; private set; }
    public string? Gender { get; private set; }
    public int? Height { get; private set; }
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

    private readonly List<RouteFeedback> _feedbacks = [];
    public IReadOnlyCollection<RouteFeedback> Feedbacks => _feedbacks.AsReadOnly();

    // Credentials
    public PasswordCredential? PasswordCredential { get; private set; }

    private readonly List<ExternalCredential> _externalCredentials = [];
    public IReadOnlyCollection<ExternalCredential> ExternalCredentials => _externalCredentials.AsReadOnly();

    private readonly List<RefreshToken> _refreshTokens = [];
    public IReadOnlyCollection<RefreshToken> RefreshTokens => _refreshTokens.AsReadOnly();

    // For EF Core
    private User() { }

    public static Result<User> Create(Email email, string username, string? firstName = null, string? lastName = null, string? gender = null, int? height = null, string? city = null)
    {
        Guard.AgainstNullOrWhiteSpace(username, nameof(username));

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Username = username.Trim(),
            FirstName = firstName?.Trim(),
            LastName = lastName?.Trim(),
            Gender = gender,
            Height = height,
            City = city,
            Role = Role.Climber,
            CreatedAt = DateTime.UtcNow
        };

        return Result.Success(user);
    }

    public void UpdateProfile(string? avatarUrl, string? city, string? firstName = null, string? lastName = null, string? gender = null, int? height = null)
    {
        if (avatarUrl is not null) AvatarUrl = avatarUrl;
        if (city is not null) City = city;
        if (firstName is not null) FirstName = firstName;
        if (lastName is not null) LastName = lastName;
        if (gender is not null) Gender = gender;
        if (height.HasValue) Height = height;
    }

    public void ChangeRole(Role newRole)
    {
        Role = newRole;
    }
}
