namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;
using Enums;

/// <summary>
/// Пролаз / Отметка о прохождении трассы
/// </summary>
public class Ascent : Entity<Guid>
{
    public Guid PostId { get; private set; }
    public Guid UserId { get; private set; }
    public Guid RouteId { get; private set; }
    public AscentStyle Style { get; private set; }
    public List<string> MediaUrls { get; private set; } = [];

    public DateTime CreatedAt { get; private set; }

    // Navigation properties (lazy load not supported, but for relationships)
    private readonly Post _post = null!;
    public Post Post => _post;

    private readonly Route _route = null!;
    public Route Route => _route;

    private readonly User _user = null!;
    public User User => _user;

    private Ascent() { }

    public static Result<Ascent> Create(
        Guid postId,
        Guid userId,
        Guid routeId,
        AscentStyle style,
        List<string>? mediaUrls = null)
    {
        Guard.AgainstDefault(postId, nameof(postId));
        Guard.AgainstDefault(userId, nameof(userId));
        Guard.AgainstDefault(routeId, nameof(routeId));

        return Result.Success(new Ascent
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId,
            RouteId = routeId,
            Style = style,
            MediaUrls = mediaUrls ?? [],
            CreatedAt = DateTime.UtcNow
        });
    }


}
