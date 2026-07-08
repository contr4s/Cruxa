namespace Cruxa.Application.Features.Statistics.Contracts;

public record AscentWithRouteTags(
    Guid AscentId,
    Guid RouteId,
    Guid PostId,
    int GradeIndex,
    string Style,
    int RouteType,
    DateTime Date,
    List<string> Tags);
