using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Commands;

public record ReactivateRouteCommand(Guid Id) : IRequest<Result>;
