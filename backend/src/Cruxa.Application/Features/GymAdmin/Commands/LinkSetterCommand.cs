using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Commands;

public record LinkSetterCommand(Guid GymId, Guid UserId) : IRequest<Result>;
