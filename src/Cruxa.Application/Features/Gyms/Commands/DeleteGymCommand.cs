using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Gyms.Commands;

public record DeleteGymCommand(Guid Id) : IRequest<Result>;
