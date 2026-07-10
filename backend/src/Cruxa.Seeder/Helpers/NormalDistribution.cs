using Bogus;

namespace Cruxa.Seeder.Helpers;

/// <summary>
/// Normal distribution sampling utilities using Box-Muller transform.
/// </summary>
public static class NormalDistribution
{
    /// <summary>
    /// Returns a normally distributed sample with given mean and stdDev.
    /// </summary>
    public static double Sample(Randomizer rng, double mean = 0.0, double stdDev = 1.0)
    {
        var u1 = 1.0 - rng.Double();
        var u2 = 1.0 - rng.Double();
        var normal = Math.Sqrt(-2.0 * Math.Log(u1)) * Math.Sin(2.0 * Math.PI * u2);
        return mean + stdDev * normal;
    }

    /// <summary>
    /// Returns an integer normally distributed around mean with stdDev, clipped to [min, max].
    /// </summary>
    public static int SampleInt(Randomizer rng, double mean, double stdDev, int min, int max)
    {
        var val = Sample(rng, mean, stdDev);
        return (int)Math.Clamp(Math.Round(val), min, max);
    }
}
