using MediatR;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Users.Commands;

public record UpdateUserCommand(
    Guid Id,
    Guid CurrentUserId,
    string? City,
    string? AvatarUrl,
    string? FirstName = null,
    string? LastName = null,
    string? Gender = null,
    int? Height = null) : IRequest<Result<UserDto>>, ICommand;
