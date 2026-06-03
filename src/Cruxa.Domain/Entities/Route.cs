namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;
using Enums;
using Events;
using ValueObjects;

/// <summary>
/// Трасса на скалодроме (Entity, not aggregate root)
/// </summary>
public class Route : Entity<Guid>
{
    public Grade Grade { get; private set; }
    public RouteType Type { get; private set; }
    public HoldColor HoldColor { get; private set; }
    public List<string> PhotoUrls { get; private set; } = [];
    public List<string> Tags { get; private set; } = [];
    public string? Sector { get; private set; }
    public bool IsActive { get; private set; } = true;

    public Guid GymId { get; private set; }
    public Guid? AuthorId { get; private set; }

    // Navigation properties
    private Gym _gym = null!;
    public Gym Gym => _gym;

    public User? Author { get; private set; }

    private readonly List<Ascent> _ascents = [];
    public IReadOnlyCollection<Ascent> Ascents => _ascents.AsReadOnly();

    private readonly List<RouteReview> _reviews = [];
    public IReadOnlyCollection<RouteReview> Reviews => _reviews.AsReadOnly();

    // For EF Core
    private Route() { }

    public static Result<Route> Create(
        Guid gymId,
        Grade grade,
        RouteType type,
        HoldColor holdColor,
        Guid? authorId = null,
        List<string>? photoUrls = null,
        List<string>? tags = null,
        string? sector = null)
    {
        Guard.AgainstDefault(gymId, nameof(gymId));
        Guard.AgainstNull(grade, nameof(grade));

        var route = new Route
        {
            Id = Guid.NewGuid(),
            GymId = gymId,
            AuthorId = authorId,
            Grade = grade,
            Type = type,
            HoldColor = holdColor,
            PhotoUrls = photoUrls ?? [],
            Tags = tags ?? [],
            Sector = sector
        };

        return Result.Success(route);
    }

    public void Deactivate()
    {
        IsActive = false;
        AddDomainEvent(new RouteDeactivatedEvent(Id));
    }

    public void Update(RouteType? type, HoldColor? holdColor, List<string>? photoUrls, List<string>? tags, string? sector, bool? isActive)
    {
        if (type.HasValue) Type = type.Value;
        if (holdColor.HasValue) HoldColor = holdColor.Value;
        if (photoUrls != null) PhotoUrls = photoUrls;
        if (tags != null) Tags = tags;
        if (sector != null) Sector = sector;
        if (isActive.HasValue) IsActive = isActive.Value;
    }
}
