namespace Cruxa.Application.Features.Statistics.Options;

public class TrainingIntensityOptions
{
    public const string SectionName = "TrainingIntensity";
    public double BaselineBouldersPer2h { get; set; } = 25.0;
    public double LeadMultiplier { get; set; } = 2.0;
}
