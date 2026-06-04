using MediatR;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;
using DomainAscent = Cruxa.Domain.Entities.Ascent;

namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class AddAscentHandler : IRequestHandler<AddAscentCommand, Result>
{
    private readonly IAscentRepository _ascentRepository;
    private readonly IPostRepository _postRepository;
    private readonly IUnitOfWork _uow;

    public AddAscentHandler(IAscentRepository ascentRepository, IPostRepository postRepository, IUnitOfWork uow)
    {
        _ascentRepository = ascentRepository;
        _postRepository = postRepository;
        _uow = uow;
    }

    public async Task<Result> Handle(AddAscentCommand request, CancellationToken ct)
    {
        var post = await _postRepository.GetByIdAsync(request.PostId);
        if (post is null)
            return Result.Failure(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only add ascents to your own posts"));

        var ascentResult = DomainAscent.Create(
            request.PostId, request.UserId, request.RouteId,
            request.Style, request.MediaUrls);

        if (ascentResult.IsFailure)
            return ascentResult;

        await _ascentRepository.AddAsync(ascentResult.Value);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
