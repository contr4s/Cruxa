using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class FollowUserHandler : IRequestHandler<FollowUserCommand, Result>
{
    private readonly IFollowerRepository _repository;
    private readonly IUnitOfWork _uow;

    public FollowUserHandler(IFollowerRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

    public async Task<Result> Handle(FollowUserCommand request, CancellationToken ct)
    {
        if (request.FollowerId == request.FolloweeId)
            return Result.Failure(Error.Validation("Cannot follow yourself"));

        var followed = await _repository.FollowAsync(request.FollowerId, request.FolloweeId);
        if (!followed) return Result.Failure(Error.Conflict("Already following"));
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
