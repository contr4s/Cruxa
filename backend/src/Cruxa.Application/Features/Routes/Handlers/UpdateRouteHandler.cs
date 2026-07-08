using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.GradingSystems.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Common.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;

namespace Cruxa.Application.Features.Routes.Handlers;

public class UpdateRouteHandler(
    IRouteRepository routes,
    ITagRepository tagRepo,
    IGradingSystemRepository systems
    ) : IRequestHandler<UpdateRouteCommand, Result>
{
    public async Task<Result> Handle(UpdateRouteCommand cmd, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(cmd.Id);
        if (route is null) return Result.Failure(Error.NotFound("Route"));

        // Resolve grade if GradeRaw is provided
        Grade? newGrade = null;
        if (cmd.GradeRaw is not null)
        {
            var gradingSystem = await systems.GetByGymIdAsync(route.GymId);
            if (gradingSystem is null)
                return Result.Failure(Error.NotFound("GradingSystem for the route's gym"));

            var gradeResult = gradingSystem.ResolveGrade(cmd.GradeRaw);
            if (gradeResult.IsFailure)
                return Result.Failure(gradeResult.Error);
            newGrade = gradeResult.Value;
        }

        // Validate and resolve tags if provided
        List<Tag>? tagEntities = null;
        if (cmd.Tags is not null)
        {
            if (cmd.Tags.Count > 0)
            {
                var tagResult = await TagHelpers.ValidateAndResolveTagsAsync(cmd.Tags, tagRepo);
                if (tagResult.IsFailure)
                    return Result.Failure(tagResult.Error);
                tagEntities = tagResult.Value;
            }

            route.Update(cmd.Type, cmd.HoldColor, newGrade, cmd.Name, cmd.PhotoUrls, tagEntities, cmd.Sector, cmd.IsActive);
        }
        else
        {
            route.Update(cmd.Type, cmd.HoldColor, newGrade, cmd.Name, cmd.PhotoUrls, null, cmd.Sector, cmd.IsActive);
        }

        await routes.UpdateAsync(route);
        return Result.Success();
    }
}
