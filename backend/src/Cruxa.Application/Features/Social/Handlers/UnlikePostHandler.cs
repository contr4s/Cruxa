using MediatR;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Social.Handlers;

public sealed class UnlikePostHandler(ILikeRepository repository) : IRequestHandler<UnlikePostCommand, Result>
{
    public async Task<Result> Handle(UnlikePostCommand request, CancellationToken ct)
    {
        var unliked = await repository.UnlikePostAsync(request.PostId, request.UserId);
        if (!unliked) return Result.Failure(Error.NotFound("Like not found"));
        return Result.Success();
    }
}
