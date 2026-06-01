namespace Cruxa.Domain.Entities;

using Cruxa.Domain.Abstractions;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Domain.Events;

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

    public static Result<Post> Create(Guid userId, Guid gymId, string? description, List<string>? mediaUrls)
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
            CreatedAt = DateTime.UtcNow,
            Status = PostStatus.Draft,
            Visibility = PostVisibility.Public
        };

        post.AddDomainEvent(new PostCreatedEvent(post.Id, userId, gymId));

        return Result.Success(post);
    }

    public void Publish()
    {
        if (Status == PostStatus.Published) return;
        Status = PostStatus.Published;
        RaiseDomainEvent(new PostPublishedEvent(Id));
    }

    public void Update(string? description, List<string>? mediaUrls, PostVisibility? visibility)
    {
        if (description != null) Description = description;
        if (mediaUrls != null) MediaUrls = mediaUrls;
        if (visibility.HasValue) Visibility = visibility.Value;
    }

    public void AddAscent(Ascent ascent)
    {
        _ascents.Add(ascent);
    }
}
