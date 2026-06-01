using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetGymByIdHandler(IGymRepository gyms) : IRequestHandler<GetGymByIdQuery, Result<GymDto>>
{
    public async Task<Result<GymDto>> Handle(GetGymByIdQuery q, CancellationToken ct)
    {
        var gym = await gyms.GetByIdAsync(q.Id);
        return gym is null ? Result.Failure<GymDto>(Error.NotFound("Gym")) : Result.Success(gym.Adapt<GymDto>());
    }
}

public class GetGymsByCityHandler(IGymRepository gyms) : IRequestHandler<GetGymsByCityQuery, Result<IEnumerable<GymDto>>>
{
    public async Task<Result<IEnumerable<GymDto>>> Handle(GetGymsByCityQuery q, CancellationToken ct)
    {
        var result = await gyms.GetByCityAsync(q.City);
        return Result.Success(result.Select(g => g.Adapt<GymDto>()));
    }
}

public class GetAllGymsHandler(IGymRepository gyms) : IRequestHandler<GetAllGymsQuery, Result<IEnumerable<GymDto>>>
{
    public async Task<Result<IEnumerable<GymDto>>> Handle(GetAllGymsQuery _, CancellationToken ct)
    {
        var result = await gyms.GetAllAsync();
        return Result.Success(result.Select(g => g.Adapt<GymDto>()));
    }
}
