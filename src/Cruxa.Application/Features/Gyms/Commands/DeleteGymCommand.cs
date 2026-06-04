using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Gyms.Commands;

public record DeleteGymCommand(Guid Id) : IRequest<Result>, ICommand;
