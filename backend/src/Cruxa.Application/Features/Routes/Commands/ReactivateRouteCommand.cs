using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Routes.Commands;

public record ReactivateRouteCommand(Guid Id) : IRequest<Result>, ICommand;
