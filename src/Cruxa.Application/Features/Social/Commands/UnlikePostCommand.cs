using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Commands;

public record UnlikePostCommand(Guid PostId, Guid UserId) : IRequest<Result>;
