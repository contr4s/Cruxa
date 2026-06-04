using MediatR;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Users.Commands;

public record UpdateUserCommand(Guid Id, string? City, string? AvatarUrl) : IRequest<Result<UserDto>>;
