using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Application.Features.Statistics.Options;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Microsoft.Extensions.Options;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetMonthlyActivityHandler(IStatsRepository statsRepo, IOptions<TrainingIntensityOptions> options)
    : IRequestHandler<GetMonthlyActivityQuery, Result<MonthlyActivityDto>>
{
    private readonly TrainingIntensityOptions _opts = options.Value;

    public async Task<Result<MonthlyActivityDto>> Handle(GetMonthlyActivityQuery request, CancellationToken ct)
    {
        var (year, month) = (request.Year, request.Month);
        var from = new DateTimeOffset(year, month, 1, 0, 0, 0, TimeSpan.Zero);
        var posts = await statsRepo.GetPostsInRangeAsync(request.UserId, from, from.AddMonths(1));

        if (posts.Count == 0)
            return new MonthlyActivityDto { Year = year, Month = month };

        var daysSet = new HashSet<int>();
        var dayIntensities = new Dictionary<int, double>();
        var dayRouteCounts = new Dictionary<int, int>();

        foreach (var post in posts)
        {
            var day = post.CreatedAt.Day;
            daysSet.Add(day);

            var durationHours = (post.Duration ?? 120) / 60.0;
            var boulderCount = post.Ascents.Count(a => a.Route?.Type == RouteType.Bouldering);
            var leadCount = post.Ascents.Count(a => a.Route?.Type == RouteType.Lead);
            var weighted = (boulderCount + leadCount * _opts.LeadMultiplier);
            var intensity = weighted * (0.5 + durationHours / 4.0) / _opts.BaselineBouldersPer2h;

            dayIntensities.TryGetValue(day, out var current);
            dayIntensities[day] = current + intensity;

            dayRouteCounts.TryGetValue(day, out var rc);
            dayRouteCounts[day] = rc + post.Ascents.Count;
        }

        var days = daysSet.OrderBy(d => d).Select(d => new ActivityDayDto
        {
            Day = d,
            Intensity = dayIntensities[d],
            HasWorkout = true,
            RouteCount = dayRouteCounts.GetValueOrDefault(d)
        }).ToList();

        var weekActivity = CountWorkoutWeeks(year, month, daysSet);

        return new MonthlyActivityDto
        {
            Year = year,
            Month = month,
            Days = days,
            WeekActivity = weekActivity
        };
    }

    /// <summary>FULL weeks (Mon-Sun) entirely within the month that have at least one workout.</summary>
    private static int CountWorkoutWeeks(int year, int month, HashSet<int> workoutDays)
    {
        var daysInMonth = DateTime.DaysInMonth(year, month);
        var firstDow = (int)new DateTime(year, month, 1).DayOfWeek; // 0=Sun
        // Adjust to Mon=0 .. Sun=6
        var firstMonOffset = firstDow == 0 ? 6 : firstDow - 1;

        var weeks = 0;
        for (var day = 1; day <= daysInMonth;)
        {
            // Start of this week: Monday
            var weekStart = day;
            if (weekStart == 1 && firstMonOffset > 0)
                weekStart += 7 - firstMonOffset; // first partial week, skip

            var weekEnd = weekStart + 6;
            if (weekEnd > daysInMonth) break; // partial week at end, skip

            if (Enumerable.Range(weekStart, 7).Any(workoutDays.Contains))
                weeks++;

            day = weekEnd + 1;
        }

        return weeks;
    }
}
