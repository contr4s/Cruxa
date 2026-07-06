using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Users.Commands;

public record DeleteUserCommand(Guid Id) : IRequest<Result>, ICommand;
