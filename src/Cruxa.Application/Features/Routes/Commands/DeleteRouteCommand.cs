using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Commands;

public record DeleteRouteCommand(Guid Id) : IRequest<Result>;
