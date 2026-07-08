using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Social.Commands;

public record UnfollowUserCommand(Guid FollowerId, Guid FolloweeId) : IRequest<Result>, ICommand;
