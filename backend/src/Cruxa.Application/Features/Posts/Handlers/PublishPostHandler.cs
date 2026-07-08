using MediatR;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Statistics.Services;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class PublishPostHandler : IRequestHandler<PublishPostCommand, Result>
{
    private readonly IPostRepository _repository;
    private readonly KruscoreService _kruscore;

    public PublishPostHandler(IPostRepository repository, KruscoreService kruscore)
    {
        _repository = repository;
        _kruscore = kruscore;
    }

    public async Task<Result> Handle(PublishPostCommand request, CancellationToken ct)
    {
        var post = await _repository.GetByIdAsync(request.Id);
        if (post is null)
            return Result.Failure(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only publish your own posts"));

        post.Publish();
        await _repository.UpdateAsync(post);

        // Trigger Kruscore recalculation for this workout date
        await _kruscore.RecalculateAsync(request.UserId, DateOnly.FromDateTime(post.CreatedAt));

        return Result.Success();
    }
}
