using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Commands;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class UpdateGymHandler(IGymRepository gyms) : IRequestHandler<UpdateGymCommand, Result<GymDto>>
{
    public async Task<Result<GymDto>> Handle(UpdateGymCommand cmd, CancellationToken ct)
    {
        var gym = await gyms.GetByIdAsync(cmd.Id);
        if (gym is null) return Error.NotFound("Gym");

        gym.Update(cmd.Name, cmd.Description, cmd.City, cmd.Address, cmd.Latitude, cmd.Longitude,
            cmd.ContactInfo, cmd.Website, cmd.Prices, cmd.WorkingHours, cmd.PhotoUrls, cmd.GradingSystemId);

        await gyms.UpdateAsync(gym);
        return gym.Adapt<GymDto>();
    }
}
