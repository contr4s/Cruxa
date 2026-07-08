using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class GetFollowingHandler : IRequestHandler<GetFollowingQuery, Result<IEnumerable<Guid>>>
{
    private readonly IFollowerRepository _repository;

    public GetFollowingHandler(IFollowerRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<Guid>>> Handle(GetFollowingQuery request, CancellationToken ct)
    {
        var following = await _repository.GetFollowingAsync(request.UserId);
        return Result.Success(following);
    }
}
