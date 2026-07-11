using MediatR;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Queries;

public record GetPostsByGymQuery(Guid GymId, Guid? CurrentUserId = null) : IRequest<Result<IEnumerable<PostDto>>>;
