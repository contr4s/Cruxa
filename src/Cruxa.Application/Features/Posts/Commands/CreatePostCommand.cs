using MediatR;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Posts.Commands;

public record CreatePostCommand(
    Guid UserId,
    Guid GymId,
    string? Description,
    List<string>? MediaUrls,
    PostVisibility Visibility) : IRequest<Result<PostDto>>;
