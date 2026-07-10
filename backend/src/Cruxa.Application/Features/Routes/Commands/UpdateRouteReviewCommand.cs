using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Routes.Commands;

public record UpdateRouteReviewCommand(
    Guid Id,
    Guid UserId,
    int? Rating,
    string? PrivateNotes,
    string? PublicReview,
    int? GradeIndex = null) : IRequest<Result<RouteReviewDto>>, ICommand;
