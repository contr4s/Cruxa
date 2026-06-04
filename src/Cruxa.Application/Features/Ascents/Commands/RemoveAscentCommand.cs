using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Ascents.Commands;

public record RemoveAscentCommand(Guid Id, Guid UserId) : IRequest<Result>, ICommand;
