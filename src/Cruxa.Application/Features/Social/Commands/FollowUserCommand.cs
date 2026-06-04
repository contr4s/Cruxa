using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Social.Commands;

public record FollowUserCommand(Guid FollowerId, Guid FolloweeId) : IRequest<Result>, ICommand;
