using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.Reviews.DTOs;

namespace Cruxa.Application.Features.Routes.Reviews.Queries;

public record GetRouteReviewsByRouteQuery(Guid RouteId) : IRequest<Result<IEnumerable<RouteReviewDto>>>;
public record GetRouteReviewByUserRouteQuery(Guid RouteId, Guid UserId) : IRequest<Result<RouteReviewDto?>>;
