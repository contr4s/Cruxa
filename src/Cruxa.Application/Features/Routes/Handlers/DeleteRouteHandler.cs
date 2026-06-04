using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Routes.Handlers;

public class DeleteRouteHandler(IRouteRepository routes) : IRequestHandler<DeleteRouteCommand, Result>
{
    public async Task<Result> Handle(DeleteRouteCommand cmd, CancellationToken ct)
    {
        var route = await routes.GetByIdAsync(cmd.Id);
        if (route is null)
            return Result.Failure(Error.NotFound("Route"));

        await routes.DeleteAsync(cmd.Id);
        return Result.Success();
    }
}
