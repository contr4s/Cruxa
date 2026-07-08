using MediatR;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class GetCitiesHandler(IGymRepository gyms) : IRequestHandler<GetCitiesQuery, Result<List<string>>>
{
    public async Task<Result<List<string>>> Handle(GetCitiesQuery q, CancellationToken ct)
    {
        var cities = await gyms.GetCitiesAsync();
        return Result.Success(cities);
    }
}
