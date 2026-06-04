using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Commands;

public record DeleteRouteReviewCommand(Guid Id, Guid UserId) : IRequest<Result>;
