using MediatR;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetMyDraftHandler : IRequestHandler<GetMyDraftQuery, Result<PostDto?>>
{
    private readonly IPostRepository _repository;

    public GetMyDraftHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<PostDto?>> Handle(GetMyDraftQuery request, CancellationToken ct)
    {
        var (items, _) = await _repository.GetPagedByUserIdAsync(request.UserId, 1, 100);
        var draft = items.FirstOrDefault(p => p.Status == PostStatus.Draft);
        if (draft is null)
            return Result.Success<PostDto?>(null);

        return Result.Success<PostDto?>(GetPostByIdHandler.MapToDto(draft));
    }
}
