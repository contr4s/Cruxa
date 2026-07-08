using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Auth.Commands;

public record RegisterCommand(string Username, string Email, string Password, string? City, string? FirstName = null, string? LastName = null, string? Gender = null, int? Height = null) : IRequest<Result<AuthResponse>>, ICommand;
