using MediatR;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Queries;

public record GetPostsByUserQuery(Guid UserId, Guid? CurrentUserId = null, int Page = 1, int PageSize = 20) : IRequest<Result<OffsetPaginatedList<PostDto>>>;
