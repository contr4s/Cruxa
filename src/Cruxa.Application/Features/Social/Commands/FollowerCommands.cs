using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Commands;

public record FollowUserCommand(Guid FollowerId, Guid FolloweeId) : IRequest<Result>;
public record UnfollowUserCommand(Guid FollowerId, Guid FolloweeId) : IRequest<Result>;
