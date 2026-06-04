using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Social.Commands;

public record AddCommentCommand(Guid PostId, Guid UserId, string Content) : IRequest<Result<CommentDto>>, ICommand;
