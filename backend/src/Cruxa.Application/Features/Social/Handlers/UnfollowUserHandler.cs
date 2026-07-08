using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Social.Handlers;

public sealed class UnfollowUserHandler : IRequestHandler<UnfollowUserCommand, Result>
{
    private readonly IFollowerRepository _repository;

    public UnfollowUserHandler(IFollowerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(UnfollowUserCommand request, CancellationToken ct)
    {
        var unfollowed = await _repository.UnfollowAsync(request.FollowerId, request.FolloweeId);
        if (!unfollowed) return Result.Failure(Error.NotFound("Not following"));
        return Result.Success();
    }
}
