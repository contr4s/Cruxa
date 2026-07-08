using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Routes.Handlers;

public class DeactivateRouteHandler(IRouteRepository routes) : IRequestHandler<DeactivateRouteCommand, Result>
{
    public async Task<Result> Handle(DeactivateRouteCommand cmd, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(cmd.Id);
        if (route is null)
            return Result.Failure(Error.NotFound("Route"));

        route.Deactivate();
        await routes.UpdateAsync(route);
        return Result.Success();
    }
}
