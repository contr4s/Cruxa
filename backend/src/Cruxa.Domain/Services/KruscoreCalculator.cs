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
    public static double KFactor(double confidence, KruscoreConfig? cfg = null)
    {
        var c = cfg ?? KruscoreConfig.Default;
        return Math.Max(c.KMin, c.KBase / Math.Sqrt(confidence));
    }

    /// <summary>
    /// Exponential decay factor.
    /// </summary>
    public static double DecayFactor(int daysSinceLastSnapshot, KruscoreConfig? cfg = null)
    {
        var c = cfg ?? KruscoreConfig.Default;
        var t = daysSinceLastSnapshot / c.DecayHalfLifeDays;
        return Math.Pow(2.0, -t);
    }

    /// <summary>
    /// Grade reliability weight (w_grade). 1.0 when no ratings available.
    /// </summary>
    public static double GradeWeight(double avgUserRating, int ratingsCount, KruscoreConfig? cfg = null)
    {
        var c = cfg ?? KruscoreConfig.Default;
        if (ratingsCount <= 0) return 1.0;
        var deviation = Math.Abs(avgUserRating - c.GradeBaseline) / c.GradeDeviationScale;
        var consensus = Math.Min(1.0, ratingsCount / c.GradeConsensusDivisor);
        return 1.0 - c.GradeDeviationFactor * deviation * consensus;
    }

    /// <summary>
    /// Weight multiplier for route type (calibration only).
    /// </summary>
    public static int RouteTypeWeight(RouteType routeType, KruscoreConfig? cfg = null)
    {
        var c = cfg ?? KruscoreConfig.Default;
        return routeType switch
        {
            RouteType.Lead => c.RouteWeightLead,
            _ => c.RouteWeightOther,
        };
    }

    /// <summary>
    /// Performance Rating — used for calibration and competition scoring.
    /// Only successful ascents (Onsight/Flash/Redpoint/TopRope).
    /// Attempts and Repeats are excluded.
    /// </summary>
    public static double PerformanceRating(double[] gradeIndices, double[] sValues, int[] weights, KruscoreConfig? cfg = null)
    {
        var c = cfg ?? KruscoreConfig.Default;
        var sum = 0.0;
        var totalW = 0;
        for (var i = 0; i < gradeIndices.Length; i++)
        {
            if (sValues[i] <= 0) continue; // skip Attempt/Repeat
            sum += weights[i] * (gradeIndices[i] + c.EloScale * (sValues[i] - c.EloOffset));
            totalW += weights[i];
        }
        return totalW > 0 ? sum / totalW : c.DefaultRating;
    }

    public static double PerformanceRating(List<Ascent> ascents, KruscoreConfig? cfg = null)
    {
        var c = cfg ?? KruscoreConfig.Default;
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
            weights[i] = RouteTypeWeight(routeType, c);
        }

        return PerformanceRating(grades, sVals, weights, c);
    }
}
