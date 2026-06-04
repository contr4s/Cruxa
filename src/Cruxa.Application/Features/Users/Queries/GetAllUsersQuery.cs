using MediatR;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Users.Queries;

public record GetAllUsersQuery : IRequest<Result<IEnumerable<UserDto>>>;
