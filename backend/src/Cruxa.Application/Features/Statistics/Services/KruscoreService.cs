
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Services;
using Cruxa.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace Cruxa.Application.Features.Statistics.Services;

/// <summary>
/// Service for Kruscore calculation and retrieval.
/// Calculation is triggered externally (e.g. after post publish).
/// </summary>
public class KruscoreService
{
    private readonly IStatsRepository _statsRepo;
    private readonly ILogger<KruscoreService> _logger;

    public KruscoreService(IStatsRepository statsRepo, ILogger<KruscoreService> logger)
    {
        _statsRepo = statsRepo;
        _logger = logger;
    }

    /// <summary>
    /// Recalculate Kruscore for a specific date (called after publish/update).
    /// For the first calculation (calibration) loads all ascents once.
    /// </summary>
    public async Task RecalculateAsync(Guid userId, DateOnly date)
    {
        var lastSnapshot = await _statsRepo.GetLastSnapshotBeforeAsync(userId, date);

        if (lastSnapshot is null)
        {
            // Calibration: load all ascents once, apply PerformanceRating
            _logger.LogDebug("Calibrating Kruscore for user {UserId}: no prior snapshot found", userId);
            var allAscents = await _statsRepo.GetAllAscentsOrderedAsync(userId);
            await CalculateFullAsync(allAscents, userId, date);
        }
        else
        {
            // Incremental: only today's ascents
            var dayAscents = await _statsRepo.GetAscentsByDateAsync(userId, date);
            if (dayAscents.Count == 0)
            {
                _logger.LogDebug("No ascents on {Date} for user {UserId}, skipping Kruscore recalculation", date, userId);
                return;
            }

            await ProcessDayAsync(userId, lastSnapshot, dayAscents, date);
        }
    }

    private const int MinCalibrationWeight = 15;

    private async Task CalculateFullAsync(List<Ascent> ascents, Guid userId, DateOnly date)
    {
        var totalW = ascents.Sum(a => KruscoreCalculator.RouteTypeWeight(a.Route.Type));
        if (totalW < MinCalibrationWeight)
        {
            _logger.LogDebug("Skipping Kruscore calibration for user {UserId}: total weight {TotalWeight} < minimum {MinWeight}", userId, totalW, MinCalibrationWeight);
            return;
        }

        var theta = KruscoreCalculator.PerformanceRating(ascents);
        var confidence = ascents.Count;
        var maxAscent = ascents.MaxBy(a => a.Route.Grade.Index);
        var maxGradeIndex = maxAscent?.Route.Grade.Index ?? 0;
        var maxGradeRaw = maxAscent?.Route.Grade.Raw;

        var snapshot = new UserScoreSnapshot(userId, date, theta, confidence, maxGradeIndex, maxGradeRaw);
        await _statsRepo.UpsertSnapshotAsync(snapshot);
    }

    private async Task ProcessDayAsync(
        Guid userId, UserScoreSnapshot lastSnapshot, List<Ascent> dayAscents, DateOnly date)
    {
        var (theta, confidence, maxGrade) = (lastSnapshot.Score, lastSnapshot.Confidence, lastSnapshot.MaxGradeIndex);

        // Apply decay if this is a new day
        if (date > lastSnapshot.Date)
        {
            var daysSinceLast = (date.ToDateTime(TimeOnly.MinValue) - lastSnapshot.Date.ToDateTime(TimeOnly.MinValue)).Days;
            var decay = KruscoreCalculator.DecayFactor(Math.Max(1, daysSinceLast));
            theta -= 50 * (1 - decay) * 0.5;
            confidence *= decay;
        }

        var newMaxAscent = dayAscents.MaxBy(a => a.Route.Grade.Index);
        if (newMaxAscent is not null)
        {
            maxGrade = Math.Max(maxGrade, newMaxAscent.Route.Grade.Index);
        }
        var maxGradeRaw = newMaxAscent?.Route.Grade.Raw;
        var totalWeight = await SumWeightsAsync(dayAscents);
        var avgSurprise = BatchSurprise(dayAscents, theta, isRadar: false);
        var k           = KruscoreCalculator.KFactor(confidence);
        theta += k * avgSurprise;
        confidence += totalWeight;

        var snapshot = new UserScoreSnapshot(userId, date, theta, confidence, maxGrade, maxGradeRaw);
        await _statsRepo.UpsertSnapshotAsync(snapshot);
    }

    /// <summary>
    /// Calculate radar skills per tag.
    /// </summary>
    public async Task<Dictionary<string, double>> GetRadarSkillsAsync(Guid userId)
    {
        var ascentsWithTags = await _statsRepo.GetAscentsWithTagsAsync(userId);
        if (ascentsWithTags.Count == 0)
        {
            _logger.LogDebug("No ascents with tags for user {UserId}, radar skills empty", userId);
            return [];
        }

        var globalScore = (await _statsRepo.GetLastSnapshotBeforeAsync(userId, DateOnly.MaxValue))?.Score ?? 0;
        if  (globalScore == 0)
        {
            _logger.LogDebug("Global Kruscore is 0 for user {UserId}, radar skills empty", userId);
            return [];
        }
        
        // Group ascents by tag
        var tagAscents = new Dictionary<string, List<AscentWithRouteTags>>();
        foreach (var a in ascentsWithTags)
        {
            foreach (var tag in a.Tags)
            {
                if (!tagAscents.ContainsKey(tag.Value))
                    tagAscents[tag.Value] = [];
                tagAscents[tag.Value].Add(a);
            }
        }

        var baseline = (globalScore - 400) / 4.0;
        var result = new Dictionary<string, double>();
        foreach (var (tag, taggedAscents) in tagAscents)
        {
            if (taggedAscents.Count == 0) continue;

            var theta = baseline;
            var confidence = 1.0;
            var workouts = taggedAscents
                .GroupBy(a => a.PostId)
                .OrderBy(g => g.Min(a => a.Date));

            foreach (var workout in workouts)
            {
                var avgSurprise = BatchRadarSurprise(workout.ToList(), theta);
                var k = KruscoreCalculator.KFactor(confidence);
                theta += k * avgSurprise;
                confidence += workout.Count(); // simple count for radar
            }

            result[tag] = theta;
        }

        return result;
    }

    // ── Private helpers ──────────────────────────────────────────

    private static List<(DateTime Date, List<Ascent>)> GroupByWorkout(List<Ascent> ascents)
    {
        return ascents
            .GroupBy(a => a.PostId)
            .Select(g => (g.Min(a => a.CreatedAt), g.ToList()))
            .OrderBy(x => x.Item1)
            .ToList();
    }

    private double BatchSurprise(List<Ascent> ascents, double theta, bool isRadar)
    {
        var totalSurprise = 0.0;
        var totalWeight = 0.0;

        foreach (var a in ascents)
        {
            var routeType = a.Route.Type;
            var style = a.Style;
            var gradeIndex = a.Route.Grade.Index;

            var scale = isRadar
                ? KruscoreCalculator.GetRadarScale(style, routeType)
                : KruscoreCalculator.GetScale(style, routeType);

            var e = KruscoreCalculator.Expected(theta, gradeIndex, scale);
            var s = style == AscentStyle.Repeat
                ? KruscoreCalculator.GetRepeatS(e)
                : KruscoreCalculator.GetS(style, routeType);

            var w = 1.0; // grade weight, TODO: fetch from repo
            var surprise = w * (s - e);

            totalSurprise += surprise;
            totalWeight += w;
        }

        return totalWeight > 0 ? totalSurprise / totalWeight : 0;
    }

    private static double BatchRadarSurprise(List<AscentWithRouteTags> ascents, double theta)
    {
        var totalSurprise = 0.0;
        var totalWeight = 0.0;

        foreach (var a in ascents)
        {
            var gradeIndex = a.GradeIndex;
            var skill = (gradeIndex - 400) / 4.0;

            var scale = KruscoreCalculator.GetRadarScale(a.Style, a.RouteTypeCode);
            var e = KruscoreCalculator.Expected(theta, skill, scale);
            var s = a.Style == AscentStyle.Repeat
                ? KruscoreCalculator.GetRepeatS(e)
                : KruscoreCalculator.GetS(a.Style, a.RouteTypeCode);

            var surprise = s - e;

            totalSurprise += surprise;
            totalWeight += 1;
        }

        return totalWeight > 0 ? totalSurprise / totalWeight : 0;
    }

    private async Task<double> SumWeightsAsync(List<Ascent> ascents)
    {
        // пока нет user-ratings → все w=1.0
        // TODO: когда появятся — вызывать KruscoreCalculator.GradeWeight для каждого route
        return ascents.Count;
    }
}
