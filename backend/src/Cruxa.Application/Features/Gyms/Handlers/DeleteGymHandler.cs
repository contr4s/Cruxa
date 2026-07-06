using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Commands;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class DeleteGymHandler(IGymRepository gyms) : IRequestHandler<DeleteGymCommand, Result>
{
    public async Task<Result> Handle(DeleteGymCommand cmd, CancellationToken ct)
    {
        var gym = await gyms.GetByIdAsync(cmd.Id);
        if (gym is null)
            return Result.Failure(Error.NotFound("Gym"));

        await gyms.DeleteAsync(cmd.Id);
        return Result.Success();
    }
}
