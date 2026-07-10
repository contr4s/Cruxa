using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetGymByIdHandler(IGymRepository gyms, IGymFavoriteRepository favorites, ICurrentUserService currentUser)
    : IRequestHandler<GetGymByIdQuery, Result<GymDto>>
{
    public async Task<Result<GymDto>> Handle(GetGymByIdQuery q, CancellationToken ct)
    {
        var gym = await gyms.GetByIdAsync(q.Id);
        if (gym is null)
            return Result.Failure<GymDto>(Error.NotFound("Gym"));

        var dto = gym.Adapt<GymDto>();

        var userId = currentUser.GetUserId();
        if (userId.HasValue)
            dto.IsFavorite = await favorites.IsFavoriteAsync(userId.Value, gym.Id);

        return Result.Success(dto);
    }
}
