using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Commands;

public record UnlinkSetterCommand(Guid GymId, Guid UserId) : IRequest<Result>;
