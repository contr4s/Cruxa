using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Social.Commands;

public record FollowUserCommand(Guid FollowerId, Guid FolloweeId) : IRequest<Result>, ICommand;
