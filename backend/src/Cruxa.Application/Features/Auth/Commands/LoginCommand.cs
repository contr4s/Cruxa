using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Domain.Common;
using MediatR;

namespace Cruxa.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<Result<AuthResponse>>, ICommand;
