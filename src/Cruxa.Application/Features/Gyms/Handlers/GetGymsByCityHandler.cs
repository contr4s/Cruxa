using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetGymsByCityHandler(IGymRepository gyms) : IRequestHandler<GetGymsByCityQuery, Result<OffsetPaginatedList<GymDto>>>
{
    public async Task<Result<OffsetPaginatedList<GymDto>>> Handle(GetGymsByCityQuery q, CancellationToken ct)
    {
        var result = await gyms.GetByCityAsync(q.City);
        var dtos = result.Select(g => g.Adapt<GymDto>()).ToList();
        var total = dtos.Count;
        var paged = dtos.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).ToList();
        return Result.Success(new OffsetPaginatedList<GymDto>(paged, total, q.Page, q.PageSize));
    }
}
