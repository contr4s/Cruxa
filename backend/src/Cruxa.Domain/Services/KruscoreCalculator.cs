namespace Cruxa.Domain.Services;

using Enums;
using Entities;

/// <summary>
/// Pure domain calculator for Kruscore rating.
/// Stateless — all inputs explicit, no dependencies.
/// </summary>
public static class KruscoreCalculator
{
    /// <summary>
    /// Returns S (degree of success) for a given style and route type.
    /// </summary>
    public static double GetS(AscentStyle style, RouteType routeType) => (style, routeType) switch
    {
        // ── Lead ──────────────────────────────────────────────
        (AscentStyle.Onsight, RouteType.Lead) => 1.0,
        (AscentStyle.Flash, RouteType.Lead) => 0.9,
        (AscentStyle.Redpoint, RouteType.Lead) => 0.75,
        (AscentStyle.TopRope, RouteType.Lead) => 0.60,
        (AscentStyle.Attempt, RouteType.Lead) => 0.0,

        // ── Bouldering ─────────────────────────────────────────
        (AscentStyle.Onsight, RouteType.Bouldering) => 1.0,
        (AscentStyle.Flash, RouteType.Bouldering) => 1.0,
        (AscentStyle.Redpoint, RouteType.Bouldering) => 0.70,
        (AscentStyle.Attempt, RouteType.Bouldering) => 0.0,

        // Repeat —  handled separately via GetRepeatS
        _ => 0.0,
    };

    /// <summary>
    /// Repeat uses S = max(0.5, E) so it's neutral on easy/level routes.
    /// </summary>
    public static double GetRepeatS(double expected) => Math.Max(0.5, expected);

    /// <summary>
    /// Returns base scale for a given style and route type.
    /// Attempt divides the base by 2.
    /// </summary>
    public static double GetScale(AscentStyle style, RouteType routeType) 
    {
        var baseScale = routeType switch
        {
            RouteType.Bouldering => 100.0,
            RouteType.Lead => 75.0,
            _ => 100.0,
        };

        return style == AscentStyle.Attempt ? baseScale / 2 : baseScale;
    }

    /// <summary>
    /// Radar scale — steeper sigmoid for 0-100 skill range.
    /// </summary>
    public static double GetRadarScale(AscentStyle style, RouteType routeType)
    {
        var baseScale = 25.0;
        return style == AscentStyle.Attempt ? baseScale / 2 : baseScale;
    }

    /// <summary>
    /// Sigmoid / Elo expected score.
    /// </summary>
    public static double Expected(double theta, double gradeIndex, double scale)
        => 1.0 / (1.0 + Math.Pow(10.0, -(theta - gradeIndex) / scale));

    /// <summary>
    /// K-factor — how fast the rating adapts.
    /// </summary>
    public static double KFactor(double confidence)
        => Math.Max(5.0, 32.0 / Math.Sqrt(confidence));

    /// <summary>
    /// Exponential decay factor (halflife = 90 days).
    /// </summary>
    public static double DecayFactor(int daysSinceLastSnapshot)
    {
        var t = daysSinceLastSnapshot / 90.0;
        return Math.Pow(2.0, -t);
    }

    /// <summary>
    /// Grade reliability weight (w_grade). 1.0 when no ratings available.
    /// </summary>
    public static double GradeWeight(double avgUserRating, int ratingsCount)
    {
        if (ratingsCount <= 0) return 1.0;
        var deviation = Math.Abs(avgUserRating - 400) / 200.0; // 400 is lowest grade
        var consensus = Math.Min(1.0, ratingsCount / 10.0);
        return 1.0 - 0.3 * deviation * consensus;
    }
    /// <summary>
    /// Weight multiplier for route type (calibration only).
    /// Lead = 3 (more informative), Bouldering = 1.
    /// </summary>
    public static int RouteTypeWeight(RouteType routeType) => routeType switch
    {
        RouteType.Lead => 3,
        _ => 1,
    };

    /// <summary>
    /// Performance Rating — used for calibration and competition scoring.
    /// Only successful ascents (Onsight/Flash/Redpoint/TopRope).
    /// Attempts and Repeats are excluded.
    /// </summary>
    public static double PerformanceRating(double[] gradeIndices, double[] sValues, int[] weights, double scale = 50.0, double offset = 0.7)
    {
        var sum = 0.0;
        var totalW = 0;
        for (var i = 0; i < gradeIndices.Length; i++)
        {
            if (sValues[i] <= 0) continue; // skip Attempt/Repeat
            sum += weights[i] * (gradeIndices[i] + scale * (sValues[i] - offset));
            totalW += weights[i];
        }
        return totalW > 0 ? sum / totalW : 400.0;
    }

    public static double PerformanceRating(List<Ascent> ascents)
    {
        var grades = new double[ascents.Count];
        var sVals = new double[ascents.Count];
        var weights = new int[ascents.Count];

        for (var i = 0; i < ascents.Count; i++)
        {
            var a = ascents[i];
            grades[i] = a.Route.Grade.Index;
            var routeType = (RouteType)a.Route.Type;
            var style = a.Style;
            sVals[i] = style == AscentStyle.Repeat ? 0.0 : GetS(style, routeType);
            weights[i] = RouteTypeWeight(routeType);
        }

        return PerformanceRating(grades, sVals, weights);
    }
}
