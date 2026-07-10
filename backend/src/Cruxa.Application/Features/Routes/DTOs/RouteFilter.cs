using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Routes.DTOs;

public enum RouteSort
{
    Newest,
    Oldest,
    RatingDesc,
    RatingAsc,
    AscentsDesc,
    AscentsAsc,
    GradeAsc,
    GradeDesc,
    NameAsc,
    NameDesc,
}

public record RouteFilter
{
    // Owner/author
    public Guid? AuthorId { get; set; }
    public Guid? GymId { get; set; }

    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    // Text search
    public string? SearchQuery { get; set; }

    // Route filters
    public RouteType? Type { get; set; }
    public HoldColor? HoldColor { get; set; }
    public int? MinGradeIndex { get; set; }
    public int? MaxGradeIndex { get; set; }
    public string? Sector { get; set; }
    public Guid? SetterId { get; set; }
    public string? Tags { get; set; }
    public string? Status { get; set; } // "Active" | "Archived" | "all"

    // Related data filters
    public double? MinRating { get; set; }
    public double? MaxRating { get; set; }
    public int? MinAscents { get; set; }
    public int? MaxAscents { get; set; }

    // Time range
    public int? CreatedWithin { get; set; }

    // Sorting
    public RouteSort Sort { get; set; } = RouteSort.Newest;
}
