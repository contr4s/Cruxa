using MediatR;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Domain.Common;
using DomainAscent = Cruxa.Domain.Entities.Ascent;

namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class AddAscentHandler : IRequestHandler<AddAscentCommand, Result>
{
    private readonly IAscentRepository _ascentRepository;
    private readonly IPostRepository _postRepository;

    public AddAscentHandler(IAscentRepository ascentRepository, IPostRepository postRepository)
    {
        _ascentRepository = ascentRepository;
        _postRepository = postRepository;
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
        return Result.Success();
    }
}

public sealed class UpdateAscentHandler : IRequestHandler<UpdateAscentCommand, Result>
{
    private readonly IAscentRepository _repository;

    public UpdateAscentHandler(IAscentRepository repository) => _repository = repository;

    public async Task<Result> Handle(UpdateAscentCommand request, CancellationToken ct)
    {
        var ascent = await _repository.GetByIdAsync(request.Id);
        if (ascent is null)
            return Result.Failure(Error.NotFound("Ascent not found"));

        if (ascent.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only update your own ascents"));

        await _repository.UpdateAsync(ascent);
        return Result.Success();
    }
}

public sealed class RemoveAscentHandler : IRequestHandler<RemoveAscentCommand, Result>
{
    private readonly IAscentRepository _repository;

    public RemoveAscentHandler(IAscentRepository repository) => _repository = repository;

    public async Task<Result> Handle(RemoveAscentCommand request, CancellationToken ct)
    {
        var ascent = await _repository.GetByIdAsync(request.Id);
        if (ascent is null)
            return Result.Failure(Error.NotFound("Ascent not found"));

        if (ascent.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only remove your own ascents"));

        await _repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}

public sealed class GetAscentsByPostHandler : IRequestHandler<GetAscentsByPostQuery, Result<IEnumerable<AscentDto>>>
{
    private readonly IAscentRepository _repository;

    public GetAscentsByPostHandler(IAscentRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<AscentDto>>> Handle(GetAscentsByPostQuery request, CancellationToken ct)
    {
        var ascents = await _repository.GetByPostIdAsync(request.PostId);
        var dtos = ascents.Select(a => new AscentDto
        {
            Id = a.Id,
            RouteId = a.RouteId,
            GradeRaw = a.Route?.Grade?.Raw ?? "",
            Style = a.Style,
            MediaUrls = a.MediaUrls.ToList(),
            CreatedAt = a.CreatedAt
        });
        return Result.Success(dtos);
    }
}

public sealed class GetAscentsByUserHandler : IRequestHandler<GetAscentsByUserQuery, Result<IEnumerable<AscentDto>>>
{
    private readonly IAscentRepository _repository;

    public GetAscentsByUserHandler(IAscentRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<AscentDto>>> Handle(GetAscentsByUserQuery request, CancellationToken ct)
    {
        var ascents = await _repository.GetByUserIdAsync(request.UserId);
        var dtos = ascents.Select(a => new AscentDto
        {
            Id = a.Id,
            RouteId = a.RouteId,
            GradeRaw = a.Route?.Grade?.Raw ?? "",
            Style = a.Style,
            MediaUrls = a.MediaUrls.ToList(),
            CreatedAt = a.CreatedAt
        });
        return Result.Success(dtos);
    }
}
