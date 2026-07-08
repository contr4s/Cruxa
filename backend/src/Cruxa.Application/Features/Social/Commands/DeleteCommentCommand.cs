using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Social.Commands;

public record DeleteCommentCommand(Guid CommentId, Guid UserId) : IRequest<Result>, ICommand;
