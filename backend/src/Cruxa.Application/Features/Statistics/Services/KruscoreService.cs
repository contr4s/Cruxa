
using System.Collections.Concurrent;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Options;
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
    private readonly KruscoreConfig _cfg;
    private readonly KruscoreOptions _opts;

    public KruscoreService(IStatsRepository statsRepo, ILogger<KruscoreService> logger,
        Microsoft.Extensions.Options.IOptions<KruscoreOptions> opts)
    {
        _statsRepo = statsRepo;
        _logger = logger;
        _opts = opts.Value;
        _cfg = new KruscoreConfig
        {
            DefaultRating = _opts.DefaultRating,
            EloScale = _opts.EloScale,
            EloOffset = _opts.EloOffset,
            KBase = _opts.KBase,
            KMin = _opts.KMin,
            DecayHalfLifeDays = _opts.DecayHalfLifeDays,
            GradeBaseline = _opts.GradeBaseline,
            GradeDeviationScale = _opts.GradeDeviationScale,
            GradeDeviationFactor = _opts.GradeDeviationFactor,
            GradeConsensusDivisor = _opts.GradeConsensusDivisor,
            RouteWeightLead = _opts.RouteWeightLead,
            RouteWeightOther = _opts.RouteWeightOther,
        };
    }

    /// <summary>
    /// Recalculate Kruscore for a specific date (called after publish/update).
    /// Returns the delta (score change) caused by this day's ascents.
    /// For the first calculation (calibration) loads all ascents once.
    /// </summary>
    public async Task<double> RecalculateAsync(Guid userId, DateOnly date)
    {
        var lastSnapshot = await _statsRepo.GetLastSnapshotBeforeAsync(userId, date);

        if (lastSnapshot is null)
        {
            // Calibration: load all ascents once, apply PerformanceRating
            _logger.LogDebug("Calibrating Kruscore for user {UserId}: no prior snapshot found", userId);
            var allAscents = await _statsRepo.GetAllAscentsOrderedAsync(userId);
            return await CalculateFullAsync(allAscents, userId, date);
        }
        else
        {
            // Incremental: only today's ascents
            var dayAscents = await _statsRepo.GetAscentsByDateAsync(userId, date);
            if (dayAscents.Count == 0)
            {
                _logger.LogDebug("No ascents on {Date} for user {UserId}, skipping Kruscore recalculation", date, userId);
                return 0.0;
            }

            return await ProcessDayAsync(userId, lastSnapshot, dayAscents, date);
        }
    }

    private async Task<double> CalculateFullAsync(List<Ascent> ascents, Guid userId, DateOnly date)
    {
        var totalW = ascents.Sum(a => KruscoreCalculator.RouteTypeWeight(a.Route.Type, _cfg));
        if (totalW < _opts.MinCalibrationWeight)
        {
            _logger.LogDebug("Skipping Kruscore calibration for user {UserId}: total weight {TotalWeight} < minimum {MinWeight}", userId, totalW, _opts.MinCalibrationWeight);
            return 0;
        }

        var theta = KruscoreCalculator.PerformanceRating(ascents, _cfg);
        theta *= _opts.CalibrationDiscount; // leave room for progress
        var confidence = ascents.Count;
        var maxAscent = ascents.MaxBy(a => a.Route.Grade.Index);
        var maxGradeIndex = maxAscent?.Route.Grade.Index ?? 0;
        var maxGradeRaw = maxAscent?.Route.Grade.Raw;

        var snapshot = new UserScoreSnapshot(userId, date, theta, confidence, maxGradeIndex, maxGradeRaw);
        await _statsRepo.UpsertSnapshotAsync(snapshot);
        return 0.0; // first calibration — no prior score to compare
    }

    private async Task<double> ProcessDayAsync(
        Guid userId, UserScoreSnapshot lastSnapshot, List<Ascent> dayAscents, DateOnly date)
    {
        var oldScore = lastSnapshot.Score;
        var (theta, confidence, maxGrade) = (lastSnapshot.Score, lastSnapshot.Confidence, lastSnapshot.MaxGradeIndex);

        // Apply decay if this is a new day
        if (date > lastSnapshot.Date)
        {
            var daysSinceLast = (date.ToDateTime(TimeOnly.MinValue) - lastSnapshot.Date.ToDateTime(TimeOnly.MinValue)).Days;
            var decay = KruscoreCalculator.DecayFactor(Math.Max(1, daysSinceLast), _cfg);
            theta -= _opts.DecayBaseAmount * (1 - decay) * _opts.DecayMultiplier;
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
        var k           = KruscoreCalculator.KFactor(confidence, _cfg);
        theta += k * avgSurprise;
        confidence += totalWeight;

        var snapshot = new UserScoreSnapshot(userId, date, theta, confidence, maxGrade, maxGradeRaw);
        await _statsRepo.UpsertSnapshotAsync(snapshot);
        return theta - oldScore;
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

            var w = _routeWeightCache.GetValueOrDefault(a.RouteId, 1.0); // grade weight
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

    private readonly ConcurrentDictionary<Guid, double> _routeWeightCache = new();

    private async Task<double> SumWeightsAsync(List<Ascent> ascents)
    {
        var totalWeight = 0.0;
        var byRoute = ascents.GroupBy(a => a.RouteId);

        foreach (var group in byRoute)
        {
            var routeId = group.Key;
            var feedbacks = await _statsRepo.GetRouteFeedbackAsync(routeId);
            var ratings = feedbacks.Where(f => f.GradeIndex.HasValue).Select(f => (double)f.GradeIndex!.Value).ToList();
            var avgRating = ratings.Count > 0 ? ratings.Average() : 0;
            var count = ratings.Count;
            var weight = KruscoreCalculator.GradeWeight(avgRating, count, _cfg);
            _routeWeightCache[routeId] = weight;
            totalWeight += weight * group.Count();
        }

        return totalWeight;
    }
}
