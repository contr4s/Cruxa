using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetRouteByIdHandler(IRouteRepository routes) : IRequestHandler<GetRouteByIdQuery, Result<RouteDto>>
{
    public async Task<Result<RouteDto>> Handle(GetRouteByIdQuery q, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(q.Id);
        if (route is null)
            return Result.Failure<RouteDto>(Error.NotFound("Route"));

        return Result.Success(RouteDto.FromEntity(route));
    }
}
