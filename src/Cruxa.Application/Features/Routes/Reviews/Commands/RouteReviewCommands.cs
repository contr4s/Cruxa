using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.Reviews.DTOs;

namespace Cruxa.Application.Features.Routes.Reviews.Commands;

public record AddRouteReviewCommand(
    Guid RouteId,
    Guid UserId,
    int? Rating = null,
    string? PrivateNotes = null,
    string? PublicReview = null) : IRequest<Result<RouteReviewDto>>;

public record UpdateRouteReviewCommand(
    Guid Id,
    Guid UserId,
    int? Rating,
    string? PrivateNotes,
    string? PublicReview) : IRequest<Result<RouteReviewDto>>;

public record DeleteRouteReviewCommand(Guid Id, Guid UserId) : IRequest<Result>;
