using MediatR;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetPostsByUserHandler : IRequestHandler<GetPostsByUserQuery, Result<IEnumerable<PostDto>>>
{
    private readonly IPostRepository _repository;

    public GetPostsByUserHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<PostDto>>> Handle(GetPostsByUserQuery request, CancellationToken ct)
    {
        var posts = await _repository.GetByUserIdAsync(request.UserId);
        var dtos = posts.Select(GetPostByIdHandler.MapToDto);
        return Result.Success(dtos);
    }
}
