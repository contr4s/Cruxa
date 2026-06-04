using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Users.Commands;

public record DeleteUserCommand(Guid Id) : IRequest<Result>;
