using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Queries;

public record GetFollowersQuery(Guid UserId) : IRequest<Result<IEnumerable<Guid>>>;
public record GetFollowingQuery(Guid UserId) : IRequest<Result<IEnumerable<Guid>>>;
public record IsFollowingQuery(Guid FollowerId, Guid FolloweeId) : IRequest<Result<bool>>;
