using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetAscentDistributionHandler(IStatsRepository statsRepo)
    : IRequestHandler<GetAscentDistributionQuery, Result<List<AscentDistributionDto>>>
{
    public async Task<Result<List<AscentDistributionDto>>> Handle(GetAscentDistributionQuery request, CancellationToken ct)
    {
        var ascents = await statsRepo.GetAscentsWithRoutesAsync(request.UserId);
        return ascents
            .GroupBy(a => a.Style)
            .Select(g => new AscentDistributionDto { Type = g.Key.ToString(), Count = g.Count() })
            .ToList();
    }
}
