using MediatR;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Social.Handlers;

public sealed class LikePostHandler(ILikeRepository repository) : IRequestHandler<LikePostCommand, Result>
{
    public async Task<Result> Handle(LikePostCommand request, CancellationToken ct)
    {
        var liked = await repository.LikePostAsync(request.PostId, request.UserId);
        return liked ? Result.Success() : Result.Failure(Error.Conflict("Already liked"));
    }
}

public sealed class UnlikePostHandler(ILikeRepository repository) : IRequestHandler<UnlikePostCommand, Result>
{
    public async Task<Result> Handle(UnlikePostCommand request, CancellationToken ct)
    {
        var unliked = await repository.UnlikePostAsync(request.PostId, request.UserId);
        return unliked ? Result.Success() : Result.Failure(Error.NotFound("Like not found"));
    }
}
