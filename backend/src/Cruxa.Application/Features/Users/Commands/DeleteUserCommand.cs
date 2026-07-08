using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Users.Commands;

public record DeleteUserCommand(Guid Id) : IRequest<Result>, ICommand;
