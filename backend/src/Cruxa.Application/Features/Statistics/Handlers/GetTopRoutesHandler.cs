using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetTopRoutesHandler(IStatsRepository statsRepo)
    : IRequestHandler<GetTopRoutesQuery, Result<TopRoutesResponseDto>>
{
    public async Task<Result<TopRoutesResponseDto>> Handle(GetTopRoutesQuery request, CancellationToken ct)
    {
        var topAscents = await statsRepo.GetTopAscentsAsync(request.UserId); // top 5 for display
        var allAscents = await statsRepo.GetAscentsWithRoutesAsync(request.UserId); // all for stats

        var items = topAscents.Select(a => new TopRouteItemDto
        {
            AscentId = a.Id,
            RouteId = a.RouteId,
            Name = a.Route.Name,
            Grade = a.Route.Grade.Raw,
            HoldColor = a.Route.HoldColor.ToString(),
            AscentType = a.Style.ToString(),
            GymName = a.Route.Gym?.Name ?? "",
            GymId = a.Route.GymId,
            Rating = a.Route.Feedbacks.Count > 0 ? a.Route.Feedbacks.Average(f => (double?)f.Rating) : 0,
            Date = a.CreatedAt
        }).ToList();

        var allWithGrades = allAscents
            .Where(a => a.Route?.Grade is not null)
            .ToList();
        var totalRoutes = allWithGrades.Count;
        var grades = allWithGrades.Select(a => a.Route.Grade).ToList();
        var avgIndex = totalRoutes > 0 ? (int)Math.Round(grades.Average(g => g.Index)) : 0;
        var avgGrade = totalRoutes > 0 ? grades.FirstOrDefault(g => g.Index >= avgIndex)?.Raw ?? "" : "";
        var maxGrade = totalRoutes > 0 ? grades.MaxBy(g => g.Index)?.Raw ?? "" : "";

        return new TopRoutesResponseDto
        {
            Routes = items,
            TotalRoutes = totalRoutes,
            AvgGrade = avgGrade,
            MaxGrade = maxGrade
        };
    }
}
