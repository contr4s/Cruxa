using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Social.Handlers;

public sealed class LikePostHandler(ILikeRepository repository) : IRequestHandler<LikePostCommand, Result>
{
    public async Task<Result> Handle(LikePostCommand request, CancellationToken ct)
    {
        var liked = await repository.LikePostAsync(request.PostId, request.UserId);
        if (!liked) return Result.Failure(Error.Conflict("Already liked"));
        return Result.Success();
    }
}
