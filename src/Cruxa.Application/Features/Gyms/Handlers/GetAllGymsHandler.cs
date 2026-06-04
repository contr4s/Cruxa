using Mapster;
using MediatR;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetAllGymsHandler(IGymRepository gyms) : IRequestHandler<GetAllGymsQuery, Result<OffsetPaginatedList<GymDto>>>
{
    public async Task<Result<OffsetPaginatedList<GymDto>>> Handle(GetAllGymsQuery q, CancellationToken ct)
    {
        var (items, totalCount) = await gyms.GetAllPagedAsync(q.Page, q.PageSize);
        var dtos = items.Select(g => g.Adapt<GymDto>()).ToList();
        return Result.Success(new OffsetPaginatedList<GymDto>(dtos, totalCount, q.Page, q.PageSize));
    }
}
