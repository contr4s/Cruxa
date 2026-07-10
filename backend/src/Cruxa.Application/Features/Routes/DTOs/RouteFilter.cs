using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Routes.DTOs;

public enum RouteSort
{
    Newest,
    Oldest,
    Rating,
    Ascents,
    GradeAsc,
    GradeDesc,
    Name,
}

public record RouteFilter
{
    // Owner/author
    public Guid? AuthorId;
    public Guid? GymId;

    // Pagination
    public int Page = 1;
    public int PageSize = 10;

    // Text search
    public string? SearchQuery;

    // Route filters
    public RouteType? Type;
    public HoldColor? HoldColor;
    public int? MinGradeIndex;
    public int? MaxGradeIndex;
    public bool? IsActive;
    public string? Sector;
    public Guid? SetterId;
    public List<string>? Tags;

    // Related data filters
    public int? MinRating;
    public int? MaxRating;
    public int? MinAscentsCount;
    public int? MaxAscentsCount;

    // Time range
    public int? CreatedWithinDays;

    // Sorting
    public RouteSort Sort = RouteSort.Newest;
}
