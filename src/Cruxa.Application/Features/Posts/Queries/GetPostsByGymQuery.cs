using MediatR;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Queries;

public record GetPostsByGymQuery(Guid GymId, int Page = 1, int PageSize = 20) : IRequest<Result<IEnumerable<PostDto>>>;
