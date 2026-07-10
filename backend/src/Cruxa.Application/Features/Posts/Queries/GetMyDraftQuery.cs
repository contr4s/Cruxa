using MediatR;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Queries;

public record GetMyDraftQuery(Guid UserId) : IRequest<Result<PostDto?>>;
