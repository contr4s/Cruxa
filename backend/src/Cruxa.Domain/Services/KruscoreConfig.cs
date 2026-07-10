namespace Cruxa.Domain.Services;

/// <summary>
/// Pure-data config for KruscoreCalculator — no dependencies.
/// Defaults match current baked-in constants.
/// </summary>
public record KruscoreConfig
{
    public double DefaultRating { get; init; } = 400.0;
    public double EloScale { get; init; } = 50.0;
    public double EloOffset { get; init; } = 0.7;
    public double KBase { get; init; } = 32.0;
    public double KMin { get; init; } = 5.0;
    public double DecayHalfLifeDays { get; init; } = 90.0;
    public double GradeBaseline { get; init; } = 400.0;
    public double GradeDeviationScale { get; init; } = 200.0;
    public double GradeDeviationFactor { get; init; } = 0.3;
    public double GradeConsensusDivisor { get; init; } = 10.0;
    public int RouteWeightLead { get; init; } = 3;
    public int RouteWeightOther { get; init; } = 1;

    public static readonly KruscoreConfig Default = new();
}
