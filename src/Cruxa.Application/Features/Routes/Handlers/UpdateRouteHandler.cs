using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Handlers;

public class UpdateRouteHandler(
    IRouteRepository routes,
    ITagRepository tagRepo,
    IUnitOfWork uow) : IRequestHandler<UpdateRouteCommand, Result>
{
    public async Task<Result> Handle(UpdateRouteCommand cmd, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(cmd.Id);
        if (route is null) return Result.Failure(Error.NotFound("Route"));

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

            route.Update(cmd.Type, cmd.HoldColor, cmd.PhotoUrls, tagEntities, cmd.Sector, cmd.IsActive);
        }
        else
        {
            route.Update(cmd.Type, cmd.HoldColor, cmd.PhotoUrls, null, cmd.Sector, cmd.IsActive);
        }

        await routes.UpdateAsync(route);
        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
