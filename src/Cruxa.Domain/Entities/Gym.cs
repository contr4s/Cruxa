namespace Cruxa.Domain.Entities;

using Cruxa.Domain.Abstractions;
using Cruxa.Domain.Common;
using Cruxa.Domain.ValueObjects;

/// <summary>
/// Скалодром (Aggregate Root)
/// </summary>
public class Gym : AggregateRoot<Guid>
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public string City { get; private set; }
    public string Address { get; private set; }

    private GeoCoordinate _location = default!;
    public GeoCoordinate Location => _location;

    public string? ContactInfo { get; private set; }
    public string? Website { get; private set; }
    public string? Prices { get; private set; }
    public string? WorkingHours { get; private set; }
    public List<string> PhotoUrls { get; private set; } = [];
    public Guid? GradingSystemId { get; private set; }
    public bool IsParsed { get; private set; }

    // Navigation
    public GradingSystem? GradingSystem { get; private set; }
    private readonly List<Route> _routes = [];
    public IReadOnlyCollection<Route> Routes => _routes.AsReadOnly();
    private readonly List<Post> _posts = [];
    public IReadOnlyCollection<Post> Posts => _posts.AsReadOnly();

    private Gym() { }

    public static Result<Gym> Create(string name, string city, string address, double latitude, double longitude)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));
        Guard.AgainstNullOrWhiteSpace(city, nameof(city));
        Guard.AgainstNullOrWhiteSpace(address, nameof(address));

        var locationResult = GeoCoordinate.Create(latitude, longitude);
        if (locationResult.IsFailure) return Result.Failure<Gym>(locationResult.Error);

        return Result.Success(new Gym
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            City = city.Trim(),
            Address = address.Trim(),
            _location = locationResult.Value
        });
    }

    public void Update(
        string? name = null,
        string? description = null,
        string? city = null,
        string? address = null,
        double? latitude = null,
        double? longitude = null,
        string? contactInfo = null,
        string? website = null,
        string? prices = null,
        string? workingHours = null,
        List<string>? photoUrls = null,
        Guid? gradingSystemId = null)
    {
        if (name is not null) { Guard.AgainstNullOrWhiteSpace(name, nameof(name)); Name = name.Trim(); }
        if (description is not null) Description = description;
        if (city is not null) { Guard.AgainstNullOrWhiteSpace(city, nameof(city)); City = city.Trim(); }
        if (address is not null) { Guard.AgainstNullOrWhiteSpace(address, nameof(address)); Address = address.Trim(); }
        if (latitude.HasValue && longitude.HasValue)
        {
            var lr = GeoCoordinate.Create(latitude.Value, longitude.Value);
            if (lr.IsFailure) throw new ArgumentException(lr.Error.Message);
            _location = lr.Value;
        }
        if (contactInfo is not null) ContactInfo = contactInfo;
        if (website is not null) Website = website;
        if (prices is not null) Prices = prices;
        if (workingHours is not null) WorkingHours = workingHours;
        if (photoUrls is not null) PhotoUrls = photoUrls;
        if (gradingSystemId.HasValue) GradingSystemId = gradingSystemId;
    }
}
