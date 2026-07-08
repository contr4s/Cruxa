using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetMonthlyActivityHandler(IStatsRepository statsRepo)
    : IRequestHandler<GetMonthlyActivityQuery, Result<MonthlyActivityDto>>
{
    public async Task<Result<MonthlyActivityDto>> Handle(GetMonthlyActivityQuery request, CancellationToken ct)
    {
        var from = new DateTimeOffset(request.Year, request.Month, 1, 0, 0, 0, TimeSpan.Zero);
        var posts = await statsRepo.GetPostsInRangeAsync(request.UserId, from, from.AddMonths(1));
        var days = posts
            .Select(p => p.CreatedAt.Day)
            .Distinct()
            .OrderBy(d => d)
            .ToList();

        var streak = CalcStreak(days);

        return new MonthlyActivityDto
        {
            Year = request.Year,
            Month = request.Month,
            Days = days,
            TotalWorkouts = posts.Count,
            TotalRoutes = posts.Sum(p => p.Ascents.Count),
            Streak = streak
        };
    }

    private static int CalcStreak(List<int> days)
    {
        if (days.Count == 0) return 0;
        var streak = 1;
        var maxStreak = 1;
        for (var i = 1; i < days.Count; i++)
        {
            if (days[i] == days[i - 1] + 1) { streak++; maxStreak = Math.Max(maxStreak, streak); }
            else { streak = 1; }
        }
        return maxStreak;
    }
}
