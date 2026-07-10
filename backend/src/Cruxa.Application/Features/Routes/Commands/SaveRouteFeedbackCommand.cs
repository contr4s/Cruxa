using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Routes.Commands;

public record SaveRouteFeedbackCommand(
    Guid RouteId,
    Guid UserId,
    int? Rating,
    string? PrivateNotes,
    string? PublicReview,
    int? GradeIndex) : IRequest<Result>, ICommand;
