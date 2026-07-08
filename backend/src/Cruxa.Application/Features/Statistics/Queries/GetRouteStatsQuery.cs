using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Queries;

public record GetRouteStatsQuery(Guid RouteId) : IRequest<Result<RouteStatsDto>>;