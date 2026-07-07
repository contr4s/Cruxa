using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Queries;

public record GetCommentsByPostQuery(Guid PostId, int Page = 1, int PageSize = 20) : IRequest<Result<OffsetPaginatedList<CommentDto>>>;
