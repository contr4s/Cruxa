using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetGymsByCityHandler(IGymRepository gyms) : IRequestHandler<GetGymsByCityQuery, Result<OffsetPaginatedList<GymDto>>>
{
    public async Task<Result<OffsetPaginatedList<GymDto>>> Handle(GetGymsByCityQuery q, CancellationToken ct)
    {
        var (items, totalCount) = await gyms.GetByCityPagedAsync(q.City, q.Page, q.PageSize);
        var dtos = items.Select(g => g.Adapt<GymDto>()).ToList();
        return Result.Success(new OffsetPaginatedList<GymDto>(dtos, totalCount, q.Page, q.PageSize));
    }
}
