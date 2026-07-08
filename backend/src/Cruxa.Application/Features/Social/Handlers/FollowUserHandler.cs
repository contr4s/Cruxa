using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Social.Handlers;

public sealed class FollowUserHandler : IRequestHandler<FollowUserCommand, Result>
{
    private readonly IFollowerRepository _repository;

    public FollowUserHandler(IFollowerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(FollowUserCommand request, CancellationToken ct)
    {
        if (request.FollowerId == request.FolloweeId)
            return Result.Failure(Error.Validation("Cannot follow yourself"));

        var followed = await _repository.FollowAsync(request.FollowerId, request.FolloweeId);
        if (!followed) return Result.Failure(Error.Conflict("Already following"));
        return Result.Success();
    }
}
