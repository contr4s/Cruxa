using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetRoutesByGymQuery(RouteFilter Filter) : IRequest<Result<OffsetPaginatedList<RouteDto>>>;
