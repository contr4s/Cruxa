using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Commands;

public record DeactivateRouteCommand(Guid Id) : IRequest<Result>;
