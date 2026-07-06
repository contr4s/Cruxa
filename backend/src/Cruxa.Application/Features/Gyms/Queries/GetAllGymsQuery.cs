using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Queries;

public record GetAllGymsQuery : IRequest<Result<OffsetPaginatedList<GymDto>>>
{
    public int Page { get; }
    public int PageSize { get; }

    public GetAllGymsQuery(int page = 1, int pageSize = 20)
    {
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
    }
}
