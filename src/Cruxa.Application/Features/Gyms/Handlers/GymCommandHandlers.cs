using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class CreateGymHandler(IGymRepository gyms) : IRequestHandler<CreateGymCommand, Result<GymDto>>
{
    public async Task<Result<GymDto>> Handle(CreateGymCommand cmd, CancellationToken ct)
    {
        var result = Gym.Create(cmd.Name, cmd.City, cmd.Address, cmd.Latitude, cmd.Longitude);
        if (result.IsFailure) return Result.Failure<GymDto>(result.Error);

        var gym = result.Value;
        gym.Update(description: cmd.Description, contactInfo: cmd.ContactInfo, website: cmd.Website,
            prices: cmd.Prices, workingHours: cmd.WorkingHours, photoUrls: cmd.PhotoUrls,
            gradingSystemId: cmd.GradingSystemId);

        await gyms.AddAsync(gym);
        return gym.Adapt<GymDto>();
    }
}

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

public class DeleteGymHandler(IGymRepository gyms) : IRequestHandler<DeleteGymCommand, Result>
{
    public async Task<Result> Handle(DeleteGymCommand cmd, CancellationToken ct)
    {
        await gyms.DeleteAsync(cmd.Id);
        return Result.Success();
    }
}
