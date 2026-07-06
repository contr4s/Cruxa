using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Gyms.Queries;

public record GetGymsByCityQuery : IRequest<Result<OffsetPaginatedList<GymDto>>>
{
    public string City { get; }
    public int Page { get; }
    public int PageSize { get; }

    public GetGymsByCityQuery(string city, int page = 1, int pageSize = 20)
    {
        City = city;
        Page = Math.Max(1, page);
        PageSize = Math.Clamp(pageSize, 1, 100);
    }
}
