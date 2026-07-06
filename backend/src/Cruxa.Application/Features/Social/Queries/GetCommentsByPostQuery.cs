using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Queries;

public record GetCommentsByPostQuery(Guid PostId) : IRequest<Result<IEnumerable<CommentDto>>>;
