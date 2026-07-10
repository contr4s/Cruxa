using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routesetters.Queries;

public record GetSetterRoutesQuery(RouteFilter Filter) : IRequest<Result<OffsetPaginatedList<RouteDto>>>;
