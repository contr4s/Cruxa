using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetGymByIdHandler(IGymRepository gyms) : IRequestHandler<GetGymByIdQuery, Result<GymDto>>
{
    public async Task<Result<GymDto>> Handle(GetGymByIdQuery q, CancellationToken ct)
    {
        var gym = await gyms.GetByIdAsync(q.Id);
        return gym is null ? Result.Failure<GymDto>(Error.NotFound("Gym")) : Result.Success(gym.Adapt<GymDto>());
    }
}
