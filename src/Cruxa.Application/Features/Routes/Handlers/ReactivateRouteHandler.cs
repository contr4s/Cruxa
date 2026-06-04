using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Routes.Handlers;

public class ReactivateRouteHandler(IRouteRepository routes, IUnitOfWork uow) : IRequestHandler<ReactivateRouteCommand, Result>
{
    public async Task<Result> Handle(ReactivateRouteCommand cmd, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(cmd.Id);
        if (route is null)
            return Result.Failure(Error.NotFound("Route"));

        route.Update(null, null, null, null, null, true);
        await routes.UpdateAsync(route);
        await uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
