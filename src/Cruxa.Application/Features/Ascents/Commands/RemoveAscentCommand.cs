using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Ascents.Commands;

public record RemoveAscentCommand(Guid Id, Guid UserId) : IRequest<Result>;
