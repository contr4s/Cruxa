using MediatR;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Users.Commands;

public record UpdateUserCommand(
    Guid Id,
    Guid CurrentUserId,
    string? City,
    string? AvatarUrl) : IRequest<Result<UserDto>>, ICommand;
