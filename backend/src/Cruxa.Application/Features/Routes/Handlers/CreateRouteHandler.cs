using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.GradingSystems.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Common.Contracts;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Handlers;

public class CreateRouteHandler(
    IRouteRepository routes,
    ITagRepository tagRepo,
    IGradingSystemRepository systems
    ) : IRequestHandler<CreateRouteCommand, Result<RouteDto>>
{
    public async Task<Result<RouteDto>> Handle(CreateRouteCommand cmd, CancellationToken ct)
    {
        var gradingSystem = await systems.GetByGymIdAsync(cmd.GymId);
        if (gradingSystem is null) return Result.Failure<RouteDto>(Error.NotFound("GradingSystem"));

        var gradeResult = gradingSystem.ResolveGrade(cmd.GradeRaw);
        if (gradeResult.IsFailure) return Result.Failure<RouteDto>(gradeResult.Error);

        // Validate and resolve tags
        List<Tag>? tagEntities = null;
        if (cmd.Tags is { Count: > 0 })
        {
            var tagResult = await TagHelpers.ValidateAndResolveTagsAsync(cmd.Tags, tagRepo);
            if (tagResult.IsFailure)
                return Result.Failure<RouteDto>(tagResult.Error);
            tagEntities = tagResult.Value;
        }

        var routeResult = Route.Create(cmd.GymId, gradeResult.Value, cmd.Type, cmd.HoldColor,
            cmd.Name ?? "", cmd.AuthorId, cmd.PhotoUrls, tagEntities, cmd.Sector);
        if (routeResult.IsFailure) return Result.Failure<RouteDto>(routeResult.Error);

        await routes.AddAsync(routeResult.Value);
        return Result.Success(RouteDto.FromEntity(routeResult.Value));
    }
}
