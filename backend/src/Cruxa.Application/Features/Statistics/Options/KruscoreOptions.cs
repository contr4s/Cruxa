namespace Cruxa.Application.Features.Statistics.Options;

public class KruscoreOptions
{
    public const string SectionName = "Kruscore";

    /// <summary>PerformanceRating default when no valid ascents.</summary>
    public double DefaultRating { get; set; } = 400.0;
    /// <summary>Scale factor for Elo-like expected formula.</summary>
    public double EloScale { get; set; } = 50.0;
    /// <summary>Offset for sigmoid in PerformanceRating.</summary>
    public double EloOffset { get; set; } = 0.7;

    /// <summary>K-factor base coefficient.</summary>
    public double KBase { get; set; } = 32.0;
    /// <summary>K-factor minimum clamp.</summary>
    public double KMin { get; set; } = 5.0;

    /// <summary>Decay half-life in days.</summary>
    public double DecayHalfLifeDays { get; set; } = 90.0;
    /// <summary>Base decay amount (theta reduction per half-life).</summary>
    public double DecayBaseAmount { get; set; } = 50.0;
    /// <summary>Decay multiplier.</summary>
    public double DecayMultiplier { get; set; } = 0.5;

    /// <summary>GradeWeight baseline for deviation.</summary>
    public double GradeBaseline { get; set; } = 400.0;
    /// <summary>GradeWeight deviation divisor.</summary>
    public double GradeDeviationScale { get; set; } = 200.0;
    /// <summary>GradeWeight deviation factor clamp.</summary>
    public double GradeDeviationFactor { get; set; } = 0.3;
    /// <summary>GradeWeight consensus divisor.</summary>
    public double GradeConsensusDivisor { get; set; } = 10.0;

    /// <summary>Minimum total weight for calibration to run.</summary>
    public int MinCalibrationWeight { get; set; } = 15;

    /// <summary>Calibration theta multiplier — set &lt; 1 to leave room for progress.</summary>
    public double CalibrationDiscount { get; set; } = 0.9;

    /// <summary>Route type weight for Lead.</summary>
    public int RouteWeightLead { get; set; } = 3;
    /// <summary>Route type weight for other types.</summary>
    public int RouteWeightOther { get; set; } = 1;
}
