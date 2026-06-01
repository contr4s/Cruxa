using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.GradingSystems.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetRouteByIdHandler(IRouteRepository routes) : IRequestHandler<GetRouteByIdQuery, Result<RouteDto>>
{
    public async Task<Result<RouteDto>> Handle(GetRouteByIdQuery q, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(q.Id);
        return route is null ? Result.Failure<RouteDto>(Error.NotFound("Route")) : Result.Success(route.Adapt<RouteDto>());
    }
}

public class GetRoutesByGymHandler(IRouteRepository routes) : IRequestHandler<GetRoutesByGymQuery, Result<IEnumerable<RouteDto>>>
{
    public async Task<Result<IEnumerable<RouteDto>>> Handle(GetRoutesByGymQuery q, CancellationToken ct)
    {
        var result = await routes.GetByGymIdAsync(q.GymId);
        return Result.Success(result.Select(r => r.Adapt<RouteDto>()));
    }
}

public class GetAllRoutesHandler(IRouteRepository routes) : IRequestHandler<GetAllRoutesQuery, Result<IEnumerable<RouteDto>>>
{
    public async Task<Result<IEnumerable<RouteDto>>> Handle(GetAllRoutesQuery _, CancellationToken ct)
    {
        var result = await routes.GetAllAsync();
        return Result.Success(result.Select(r => r.Adapt<RouteDto>()));
    }
}

public class CreateRouteHandler(IRouteRepository routes, IGradingSystemRepository systems) : IRequestHandler<CreateRouteCommand, Result<RouteDto>>
{
    public async Task<Result<RouteDto>> Handle(CreateRouteCommand cmd, CancellationToken ct)
    {
        var gradingSystem = await systems.GetByGymIdAsync(cmd.GymId);
        if (gradingSystem is null) return Result.Failure<RouteDto>(Error.NotFound("GradingSystem"));

        var gradeResult = gradingSystem.ResolveGrade(cmd.GradeRaw);
        if (gradeResult.IsFailure) return Result.Failure<RouteDto>(gradeResult.Error);

        var routeResult = Route.Create(cmd.GymId, gradeResult.Value, cmd.Type, cmd.HoldColor,
            cmd.AuthorId, cmd.PhotoUrls, cmd.Tags, cmd.Sector);
        if (routeResult.IsFailure) return Result.Failure<RouteDto>(routeResult.Error);

        await routes.AddAsync(routeResult.Value);
        return Result.Success(routeResult.Value.Adapt<RouteDto>());
    }
}

public class UpdateRouteHandler(IRouteRepository routes) : IRequestHandler<UpdateRouteCommand, Result>
{
    public async Task<Result> Handle(UpdateRouteCommand cmd, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(cmd.Id);
        if (route is null) return Result.Failure(Error.NotFound("Route"));

        route.Update(cmd.Type, cmd.HoldColor, cmd.PhotoUrls, cmd.Tags, cmd.Sector, cmd.IsActive);
        await routes.UpdateAsync(route);
        return Result.Success();
    }
}

public class DeleteRouteHandler(IRouteRepository routes) : IRequestHandler<DeleteRouteCommand, Result>
{
    public async Task<Result> Handle(DeleteRouteCommand cmd, CancellationToken ct)
    {
        await routes.DeleteAsync(cmd.Id);
        return Result.Success();
    }
}
