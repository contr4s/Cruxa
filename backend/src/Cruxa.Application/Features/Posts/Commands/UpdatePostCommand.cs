using MediatR;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Posts.Commands;

public record UpdatePostCommand(
    Guid Id,
    Guid UserId,
    string? Description,
    List<string>? MediaUrls,
    PostVisibility? Visibility,
    int? Duration = null) : IRequest<Result<PostDto>>, ICommand;
