using MediatR;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Auth.Queries;

public record LoginQuery(string Email, string Password) : IRequest<Result<AuthResponse>>;
