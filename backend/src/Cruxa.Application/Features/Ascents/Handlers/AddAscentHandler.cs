using Mapster;
using MediatR;
using Cruxa.Application.Features.Ascents.Contracts;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Domain.Common;
using DomainAscent = Cruxa.Domain.Entities.Ascent;

namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class AddAscentHandler : IRequestHandler<AddAscentCommand, Result<AscentDto>>
{
    private readonly IAscentRepository _ascentRepository;
    private readonly IPostRepository _postRepository;
    private readonly IRouteRepository _routeRepository;

    public AddAscentHandler(
        IAscentRepository ascentRepository,
        IPostRepository postRepository,
        IRouteRepository routeRepository)
    {
        _ascentRepository = ascentRepository;
        _postRepository = postRepository;
        _routeRepository = routeRepository;
    }

    public async Task<Result<AscentDto>> Handle(AddAscentCommand request, CancellationToken ct)
    {
        var post = await _postRepository.GetByIdAsync(request.PostId);
        if (post is null)
            return Result.Failure<AscentDto>(Error.NotFound("Post not found"));

        if (post.UserId != request.UserId)
            return Result.Failure<AscentDto>(Error.Unauthorized("You can only add ascents to your own posts"));

        var ascentResult = DomainAscent.Create(
            request.PostId, request.UserId, request.RouteId,
            request.Style, request.MediaUrls);

        if (ascentResult.IsFailure)
            return Result.Failure<AscentDto>(ascentResult.Error);

        await _ascentRepository.AddAsync(ascentResult.Value);

        var route = await _routeRepository.GetByIdAsync(request.RouteId);
        var dto = ascentResult.Value.Adapt<AscentDto>();
        // ponytail: Route nav not loaded on new entity; overwrite route fields from separate query
        if (route != null)
        {
            dto.RouteName = route.Name;
            dto.Grade = route.Grade.Raw;
            dto.GradeIndex = route.Grade.Index;
            dto.HoldColor = route.HoldColor;
            dto.Tags = route.Tags.Select(t => new TagDto { Name = t.Value, Category = t.Category }).ToList();
        }
        return Result.Success(dto);
    }
}
