using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class CreateGymHandler(IGymRepository gyms, IUnitOfWork uow) : IRequestHandler<CreateGymCommand, Result<GymDto>>
{
    public async Task<Result<GymDto>> Handle(CreateGymCommand cmd, CancellationToken ct)
    {
        var result = Gym.Create(cmd.Name, cmd.City, cmd.Address, cmd.Latitude, cmd.Longitude);
        if (result.IsFailure) return Result.Failure<GymDto>(result.Error);

        var gym = result.Value;
        var gradingSystemId = cmd.GradingSystemId ?? new Guid("00000000-0000-0000-0000-000000000001");
            gym.Update(description: cmd.Description, contactInfo: cmd.ContactInfo, website: cmd.Website,
            prices: cmd.Prices, workingHours: cmd.WorkingHours, photoUrls: cmd.PhotoUrls,
            gradingSystemId: gradingSystemId);

        await gyms.AddAsync(gym);
        await uow.SaveChangesAsync(ct);
        return gym.Adapt<GymDto>();
    }
}
