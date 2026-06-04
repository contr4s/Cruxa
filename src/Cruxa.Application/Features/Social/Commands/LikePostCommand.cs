using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Commands;

public record LikePostCommand(Guid PostId, Guid UserId) : IRequest<Result>;
