using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class UnlikePostHandler(ILikeRepository repository, IUnitOfWork uow) : IRequestHandler<UnlikePostCommand, Result>
{
    public async Task<Result> Handle(UnlikePostCommand request, CancellationToken ct)
    {
        var unliked = await repository.UnlikePostAsync(request.PostId, request.UserId);
        if (!unliked) return Result.Failure(Error.NotFound("Like not found"));
        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
