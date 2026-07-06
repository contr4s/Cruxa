using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class GetFollowersHandler : IRequestHandler<GetFollowersQuery, Result<IEnumerable<Guid>>>
{
    private readonly IFollowerRepository _repository;

    public GetFollowersHandler(IFollowerRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<Guid>>> Handle(GetFollowersQuery request, CancellationToken ct)
    {
        var followers = await _repository.GetFollowersAsync(request.UserId);
        return Result.Success(followers);
    }
}
