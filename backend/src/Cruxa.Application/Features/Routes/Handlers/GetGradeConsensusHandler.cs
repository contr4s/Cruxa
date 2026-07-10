using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.GradingSystems.Contracts;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class GetGradeConsensusHandler : IRequestHandler<GetGradeConsensusQuery, Result<GradeConsensusDto>>
{
    private readonly IRouteFeedbackRepository _repository;
    private readonly IRouteRepository _routes;
    private readonly IGradingSystemRepository _gradingSystems;

    public GetGradeConsensusHandler(
        IRouteFeedbackRepository repository,
        IRouteRepository routes,
        IGradingSystemRepository gradingSystems)
    {
        _repository = repository;
        _routes = routes;
        _gradingSystems = gradingSystems;
    }

    public async Task<Result<GradeConsensusDto>> Handle(GetGradeConsensusQuery request, CancellationToken ct)
    {
        var route = await _routes.GetByIdAsync(request.RouteId);
        if (route is null)
            return Result.Failure<GradeConsensusDto>(Error.NotFound("Route not found"));

        var gradingSystemId = route.Gym?.GradingSystemId;
        GradingSystem? gradingSystem = null;
        if (gradingSystemId.HasValue)
            gradingSystem = await _gradingSystems.GetByIdAsync(gradingSystemId.Value);

        var distribution = await _repository.GetGradeDistributionAsync(request.RouteId);

        var totalVotes = distribution.Sum(d => d.Count);

        var dto = new GradeConsensusDto
        {
            RouteId = request.RouteId,
            GradeDistribution = distribution.Select(d => new GradeVoteCountDto
            {
                GradeIndex = d.GradeIndex,
                Grade = gradingSystem?.ResolveGrade(d.GradeIndex).Value?.Raw,
                Count = d.Count
            }).ToList(),
            TotalVotes = totalVotes,
        };

        if (totalVotes > 0)
        {
            var sorted = distribution.OrderBy(d => d.GradeIndex).ToList();
            var mid = (totalVotes + 1) / 2;
            var cumulative = 0;
            foreach (var d in sorted)
            {
                cumulative += d.Count;
                if (cumulative >= mid)
                {
                    dto.ConsensusGrade = gradingSystem?.ResolveGrade(d.GradeIndex).Value?.Raw;
                    break;
                }
            }
        }

        if (request.CurrentUserId.HasValue)
        {
            var userVoteIndex = await _repository.GetUserGradeVoteAsync(request.RouteId, request.CurrentUserId.Value);
            if (userVoteIndex.HasValue)
                dto.UserVote = gradingSystem?.ResolveGrade(userVoteIndex.Value).Value?.Raw;
        }

        return Result.Success(dto);
    }
}
