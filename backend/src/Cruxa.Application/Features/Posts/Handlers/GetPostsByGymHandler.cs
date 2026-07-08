using MediatR;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class GetPostsByGymHandler : IRequestHandler<GetPostsByGymQuery, Result<IEnumerable<PostDto>>>
{
    private readonly IPostRepository _repository;

    public GetPostsByGymHandler(IPostRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<PostDto>>> Handle(GetPostsByGymQuery request, CancellationToken ct)
    {
        var posts = await _repository.GetByGymIdAsync(request.GymId);
        var dtos = posts.Select(GetPostByIdHandler.MapToDto);
        return Result.Success(dtos);
    }
}
