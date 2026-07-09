using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Statistics.Contracts;

public record AscentWithRouteTags(
    Guid AscentId,
    Guid RouteId,
    Guid PostId,
    int GradeIndex,
    AscentStyle Style,
    RouteType RouteTypeCode,
    DateTime Date,
    List<(string Value, string? Category)> Tags);
