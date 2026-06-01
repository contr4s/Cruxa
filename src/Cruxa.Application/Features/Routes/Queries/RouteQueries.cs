using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetRouteByIdQuery(Guid Id) : IRequest<Result<RouteDto>>;
public record GetRoutesByGymQuery(Guid GymId) : IRequest<Result<IEnumerable<RouteDto>>>;
public record GetAllRoutesQuery : IRequest<Result<IEnumerable<RouteDto>>>;
