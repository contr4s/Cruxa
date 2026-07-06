namespace Cruxa.Domain.Entities;

using System.Text.Json.Serialization;
using Abstractions;
using Common;
using ValueObjects;

/// <summary>
/// Скалодром (Aggregate Root)
/// </summary>
public class Gym : AggregateRoot<Guid>
{
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public string City { get; private set; }
    public string Address { get; private set; }

    private GeoCoordinate? _location;
    public GeoCoordinate? Location => _location;

    public string? ContactInfo { get; private set; }
    public string? ContactEmail { get; private set; }
    public List<string> SocialLinks { get; private set; } = [];
    public string? Website { get; private set; }
    public List<PriceItem> Prices { get; private set; } = [];
    public List<WorkingHoursEntry> WorkingHours { get; private set; } = [];
    public List<string> PhotoUrls { get; private set; } = [];
    public Guid? GradingSystemId { get; private set; }
    public bool IsParsed { get; private set; }

    // New fields from climbingpro.ru
    public double? WallArea { get; private set; }
    public double? MaxHeight { get; private set; }
    public int? YearFounded { get; private set; }
    public List<string> MetroStations { get; private set; } = [];
    public List<string> Tags { get; private set; } = [];

    // Navigation
    public GradingSystem? GradingSystem { get; private set; }
    private readonly List<Route> _routes = [];
    public IReadOnlyCollection<Route> Routes => _routes.AsReadOnly();
    private readonly List<Post> _posts = [];
    public IReadOnlyCollection<Post> Posts => _posts.AsReadOnly();

    private Gym() { }

    public static Result<Gym> Create(
        string name,
        string city,
        string address,
        double? latitude = null,
        double? longitude = null)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));
        Guard.AgainstNullOrWhiteSpace(city, nameof(city));
        Guard.AgainstNullOrWhiteSpace(address, nameof(address));

        GeoCoordinate? location = null;
        if (latitude.HasValue && longitude.HasValue)
        {
            var locationResult = GeoCoordinate.Create(latitude.Value, longitude.Value);
            if (locationResult.IsFailure) return Result.Failure<Gym>(locationResult.Error);
            location = locationResult.Value;
        }

        return Result.Success(new Gym
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            City = city.Trim(),
            Address = address.Trim(),
            _location = location
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
        string? contactEmail = null,
        List<string>? socialLinks = null,
        string? website = null,
        List<PriceItem>? prices = null,
        List<WorkingHoursEntry>? workingHours = null,
        List<string>? photoUrls = null,
        Guid? gradingSystemId = null,
        double? wallArea = null,
        double? maxHeight = null,
        int? yearFounded = null,
        List<string>? metroStations = null,
        List<string>? tags = null)
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
        if (contactEmail is not null) ContactEmail = contactEmail;
        if (socialLinks is not null) SocialLinks = socialLinks;
        if (workingHours is not null) WorkingHours = workingHours;
        if (website is not null) Website = website;
        if (prices is not null) Prices = prices;
        if (photoUrls is not null) PhotoUrls = photoUrls;
        if (gradingSystemId.HasValue) GradingSystemId = gradingSystemId;
        if (wallArea.HasValue) WallArea = wallArea;
        if (maxHeight.HasValue) MaxHeight = maxHeight;
        if (yearFounded.HasValue) YearFounded = yearFounded;
        if (metroStations is not null) MetroStations = metroStations;
        if (tags is not null) Tags = tags;
    }

    /// <summary>
    /// Marks this gym as imported from an external parser source.
    /// </summary>
    public void MarkAsParsed()
    {
        IsParsed = true;
    }
}
