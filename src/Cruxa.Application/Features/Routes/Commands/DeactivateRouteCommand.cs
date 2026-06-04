using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Routes.Commands;

public record DeactivateRouteCommand(Guid Id) : IRequest<Result>, ICommand;
