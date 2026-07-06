using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Auth.Commands;

public record RegisterCommand(string Username, string Email, string Password, string? City) : IRequest<Result<AuthResponse>>, ICommand;
