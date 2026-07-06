using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Routes.Handlers;

public class ReactivateRouteHandler(IRouteRepository routes) : IRequestHandler<ReactivateRouteCommand, Result>
{
    public async Task<Result> Handle(ReactivateRouteCommand cmd, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(cmd.Id);
        if (route is null)
            return Result.Failure(Error.NotFound("Route"));

        route.Reactivate();
        await routes.UpdateAsync(route);
        return Result.Success();
    }
}
