using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Commands;

public record FollowUserCommand(Guid FollowerId, Guid FolloweeId) : IRequest<Result>;
