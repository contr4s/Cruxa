using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetRouteByIdQuery(Guid Id) : IRequest<Result<RouteDto>>;
