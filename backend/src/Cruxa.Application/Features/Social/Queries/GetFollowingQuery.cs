using MediatR;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Queries;

public record GetFollowingQuery(Guid UserId) : IRequest<Result<List<UserDto>>>;
