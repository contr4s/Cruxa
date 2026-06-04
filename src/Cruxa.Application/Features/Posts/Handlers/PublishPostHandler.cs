using MediatR;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Posts.Handlers;

public sealed class PublishPostHandler : IRequestHandler<PublishPostCommand, Result>
{
    private readonly IPostRepository _repository;
    private readonly IUnitOfWork _uow;

    public PublishPostHandler(IPostRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
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
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
