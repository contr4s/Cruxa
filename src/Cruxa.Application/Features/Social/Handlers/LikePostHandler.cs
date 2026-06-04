using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class LikePostHandler(ILikeRepository repository, IUnitOfWork uow) : IRequestHandler<LikePostCommand, Result>
{
    public async Task<Result> Handle(LikePostCommand request, CancellationToken ct)
    {
        var liked = await repository.LikePostAsync(request.PostId, request.UserId);
        if (!liked) return Result.Failure(Error.Conflict("Already liked"));
        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
