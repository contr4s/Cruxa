namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;
using Enums;

/// <summary>
/// Пост-тренировка (отчет о посещении скалодрома) - Aggregate Root
/// </summary>
public class Post : AggregateRoot<Guid>
{
    public Guid UserId { get; private set; }
    public Guid GymId { get; private set; }
    public string? Description { get; private set; }
    public List<string> MediaUrls { get; private set; } = [];
    public PostVisibility Visibility { get; private set; } = PostVisibility.Public;
    public PostStatus Status { get; private set; } = PostStatus.Draft;
    public int? Duration { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private readonly List<Ascent> _ascents = [];
    public IReadOnlyCollection<Ascent> Ascents => _ascents.AsReadOnly();

    private readonly List<Like> _likes = [];
    public IReadOnlyCollection<Like> Likes => _likes.AsReadOnly();

    private readonly List<Comment> _comments = [];
    public IReadOnlyCollection<Comment> Comments => _comments.AsReadOnly();

    private User _user = null!;
    public User User => _user;

    private Gym _gym = null!;
    public Gym Gym => _gym;

    private Post() { }

    public static Result<Post> Create(Guid userId, Guid gymId, string? description, List<string>? mediaUrls, int? duration = null)
    {
        Guard.AgainstDefault(userId, nameof(userId));
        Guard.AgainstDefault(gymId, nameof(gymId));

        var post = new Post
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GymId = gymId,
            Description = description,
            MediaUrls = mediaUrls ?? [],
            Duration = duration,
            CreatedAt = DateTime.UtcNow,
            Status = PostStatus.Draft,
            Visibility = PostVisibility.Public
        };

        return Result.Success(post);
    }

    public void Publish()
    {
        if (Status == PostStatus.Published) return;
        Status = PostStatus.Published;
    }

    public void Update(string? description, List<string>? mediaUrls, PostVisibility? visibility, int? duration = null)
    {
        if (description != null) Description = description;
        if (mediaUrls != null) MediaUrls = mediaUrls;
        if (visibility.HasValue) Visibility = visibility.Value;
        if (duration.HasValue) Duration = duration;
    }

    public void AddAscent(Ascent ascent)
    {
        _ascents.Add(ascent);
    }
}
