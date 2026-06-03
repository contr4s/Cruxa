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

public record UpdatePostCommand(
    Guid Id,
    Guid UserId,
    string? Description,
    List<string>? MediaUrls,
    PostVisibility? Visibility) : IRequest<Result<PostDto>>;

public record PublishPostCommand(Guid Id, Guid UserId) : IRequest<Result>;

public record DeletePostCommand(Guid Id, Guid UserId) : IRequest<Result>;
