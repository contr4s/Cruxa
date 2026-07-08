using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetPostsByUserHandler : IRequestHandler<GetPostsByUserQuery, Result<OffsetPaginatedList<PostDto>>>
{
    private readonly IPostRepository _repository;

    public GetPostsByUserHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<OffsetPaginatedList<PostDto>>> Handle(GetPostsByUserQuery request, CancellationToken ct)
    {
        var (items, totalCount) = await _repository.GetPagedByUserIdAsync(request.UserId, request.Page, request.PageSize);

        // Filter visibility: only Public and own Private/Followers posts
        var filtered = items
            .Where(p => p.Visibility == PostVisibility.Public || p.UserId == request.CurrentUserId)
            .ToList();

        var dtos = filtered.Select(GetPostByIdHandler.MapToDto).ToList();
        return Result.Success(new OffsetPaginatedList<PostDto>(dtos, filtered.Count, request.Page, request.PageSize));
    }
}
