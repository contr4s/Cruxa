using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Queries;

public record GetAllGymsQuery : IRequest<Result<OffsetPaginatedList<GymDto>>>
{
    public int Page { get; }
    public int PageSize { get; }
    public string? City { get; }
    public GymSort? Sort { get; }

    public GetAllGymsQuery(int page = 1, int pageSize = 10, string? city = null, GymSort? sort = null)
    {
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 10);
        City = city;
        Sort = sort;
    }
}
