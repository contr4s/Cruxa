using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class UnfollowUserHandler : IRequestHandler<UnfollowUserCommand, Result>
{
    private readonly IFollowerRepository _repository;
    private readonly IUnitOfWork _uow;

    public UnfollowUserHandler(IFollowerRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

    public async Task<Result> Handle(UnfollowUserCommand request, CancellationToken ct)
    {
        var unfollowed = await _repository.UnfollowAsync(request.FollowerId, request.FolloweeId);
        if (!unfollowed) return Result.Failure(Error.NotFound("Not following"));
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
