using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Social.Queries;

namespace Cruxa.Application.Features.Social.Commands;

public record AddCommentCommand(Guid PostId, Guid UserId, string Content) : IRequest<Result<CommentDto>>;
public record DeleteCommentCommand(Guid CommentId, Guid UserId) : IRequest<Result>;
