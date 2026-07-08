using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<Result<AuthResponse>>, ICommand;
