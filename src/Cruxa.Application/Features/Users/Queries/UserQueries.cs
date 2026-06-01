using MediatR;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Users.Queries;

public record GetUserByIdQuery(Guid Id) : IRequest<Result<UserDto>>;
public record GetUserByUsernameQuery(string Username) : IRequest<Result<UserDto>>;
public record GetAllUsersQuery : IRequest<Result<IEnumerable<UserDto>>>;
