using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.DTOs;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetRouteReviewByUserRouteQuery(Guid RouteId, Guid UserId) : IRequest<Result<RouteReviewDto?>>;
