using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetAllGymsHandler(IGymRepository gyms, IGymFavoriteRepository favorites, ICurrentUserService currentUser)
    : IRequestHandler<GetAllGymsQuery, Result<OffsetPaginatedList<GymDto>>>
{
    public async Task<Result<OffsetPaginatedList<GymDto>>> Handle(GetAllGymsQuery q, CancellationToken ct)
    {
        var (items, totalCount) = await gyms.GetAllPagedAsync(q.Page, q.PageSize, q.City, q.Sort);
        var dtos = items.Select(g =>
        {
            var dto = g.Adapt<GymDto>();
            dto.RouteCount = g.Routes?.Count ?? 0;
            dto.ActiveRouteCount = g.Routes?.Count(r => r.IsActive) ?? 0;
            return dto;
        }).ToList();

        var userId = currentUser.GetUserId();
        if (userId.HasValue)
        {
            var favIds = await favorites.GetFavoriteGymIdsAsync(userId.Value);
            var favSet = favIds.ToHashSet();
            foreach (var dto in dtos)
                dto.IsFavorite = favSet.Contains(dto.Id);
        }

        return Result.Success(new OffsetPaginatedList<GymDto>(dtos, totalCount, q.Page, q.PageSize));
    }
}
