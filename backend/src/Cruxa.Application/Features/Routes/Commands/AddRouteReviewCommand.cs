using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Routes.Commands;

public record AddRouteReviewCommand(
    Guid RouteId,
    Guid UserId,
    int? Rating = null,
    string? PrivateNotes = null,
    string? PublicReview = null) : IRequest<Result<RouteReviewDto>>, ICommand;
