using Cruxa.Domain.Enums;
using Cruxa.Domain.Services;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Services;

public class KruscoreCalculatorTests
{
    // ── S (degree of success) ─────────────────────────────────

    [Theory]
    [InlineData(AscentStyle.Onsight, RouteType.Lead, 1.0)]
    [InlineData(AscentStyle.Flash, RouteType.Lead, 0.9)]
    [InlineData(AscentStyle.Redpoint, RouteType.Lead, 0.75)]
    [InlineData(AscentStyle.TopRope, RouteType.Lead, 0.60)]
    [InlineData(AscentStyle.Attempt, RouteType.Lead, 0.0)]
    [InlineData(AscentStyle.Onsight, RouteType.Bouldering, 1.0)]
    [InlineData(AscentStyle.Flash, RouteType.Bouldering, 1.0)]
    [InlineData(AscentStyle.Redpoint, RouteType.Bouldering, 0.70)]
    [InlineData(AscentStyle.Attempt, RouteType.Bouldering, 0.0)]
    public void GetS_ReturnsCorrectValue(AscentStyle style, RouteType routeType, double expected)
    {
        var result = KruscoreCalculator.GetS(style, routeType);
        result.Should().BeApproximately(expected, 0.001);
    }

    [Fact]
    public void GetS_OnsightEqualsFlash_ForBouldering()
    {
        var onsight = KruscoreCalculator.GetS(AscentStyle.Onsight, RouteType.Bouldering);
        var flash = KruscoreCalculator.GetS(AscentStyle.Flash, RouteType.Bouldering);
        onsight.Should().Be(flash);
    }

    // ── Repeat S ──────────────────────────────────────────────

    [Theory]
    [InlineData(0.3, 0.5)]
    [InlineData(0.5, 0.5)]
    [InlineData(0.7, 0.7)]
    [InlineData(0.91, 0.91)]
    public void GetRepeatS_ReturnsMax(double e, double expected)
    {
        var result = KruscoreCalculator.GetRepeatS(e);
        result.Should().BeApproximately(expected, 0.001);
    }

    // ── Scale ─────────────────────────────────────────────────

    [Theory]
    [InlineData(AscentStyle.Flash, RouteType.Bouldering, 100.0)]
    [InlineData(AscentStyle.Attempt, RouteType.Bouldering, 50.0)]
    [InlineData(AscentStyle.Flash, RouteType.Lead, 75.0)]
    [InlineData(AscentStyle.Attempt, RouteType.Lead, 37.5)]
    [InlineData(AscentStyle.Flash, RouteType.Speed, 100.0)]
    public void GetScale_ReturnsCorrect(AscentStyle style, RouteType type, double expected)
    {
        var result = KruscoreCalculator.GetScale(style, type);
        result.Should().BeApproximately(expected, 0.001);
    }

    [Theory]
    [InlineData(AscentStyle.Flash, RouteType.Bouldering, 25.0)]
    [InlineData(AscentStyle.Attempt, RouteType.Bouldering, 12.5)]
    [InlineData(AscentStyle.Flash, RouteType.Lead, 25.0)]
    [InlineData(AscentStyle.Attempt, RouteType.Lead, 12.5)]
    public void GetRadarScale_ReturnsCorrect(AscentStyle style, RouteType type, double expected)
    {
        var result = KruscoreCalculator.GetRadarScale(style, type);
        result.Should().BeApproximately(expected, 0.001);
    }

    // ── Expected (sigmoid) ────────────────────────────────────

    [Fact]
    public void Expected_WhenThetaEqualsGrade_ReturnsHalf()
    {
        var result = KruscoreCalculator.Expected(600, 600, 100);
        result.Should().BeApproximately(0.5, 0.001);
    }

    [Fact]
    public void Expected_WhenThetaAboveGrade_ReturnsAboveHalf()
    {
        var result = KruscoreCalculator.Expected(600, 500, 100);
        result.Should().BeGreaterThan(0.5);
    }

    [Fact]
    public void Expected_WhenThetaBelowGrade_ReturnsBelowHalf()
    {
        var result = KruscoreCalculator.Expected(500, 600, 100);
        result.Should().BeLessThan(0.5);
    }

    [Fact]
    public void Expected_ScaleSmaller_SteeperCurve()
    {
        var wide = KruscoreCalculator.Expected(600, 520, 100);
        var steep = KruscoreCalculator.Expected(600, 520, 25);
        steep.Should().BeGreaterThan(wide);
    }

    // ── K-Factor ──────────────────────────────────────────────

    [Fact]
    public void KFactor_HighConfidence_ReturnsMin5()
    {
        var result = KruscoreCalculator.KFactor(200);
        result.Should().Be(5.0);
    }

    [Fact]
    public void KFactor_LowConfidence_ReturnsHigher()
    {
        var high = KruscoreCalculator.KFactor(100);
        var low = KruscoreCalculator.KFactor(10);
        low.Should().BeGreaterThan(high);
    }

    [Fact]
    public void KFactor_MinimumIs5()
    {
        var result = KruscoreCalculator.KFactor(9999);
        result.Should().Be(5.0);
    }

    // ── Decay ─────────────────────────────────────────────────

    [Fact]
    public void DecayFactor_NoPass_Returns1()
    {
        var result = KruscoreCalculator.DecayFactor(0);
        result.Should().BeApproximately(1.0, 0.001);
    }

    [Fact]
    public void DecayFactor_Halflife_ReturnsHalf()
    {
        var result = KruscoreCalculator.DecayFactor(90);
        result.Should().BeApproximately(0.5, 0.01);
    }

    [Fact]
    public void DecayFactor_DoubleHalflife_ReturnsQuarter()
    {
        var result = KruscoreCalculator.DecayFactor(180);
        result.Should().BeApproximately(0.25, 0.01);
    }

    // ── GradeWeight ───────────────────────────────────────────

    [Fact]
    public void GradeWeight_NoRatings_Returns1()
    {
        var result = KruscoreCalculator.GradeWeight(0, 0);
        result.Should().Be(1.0);
    }

    [Fact]
    public void GradeWeight_PerfectMatch_Returns1()
    {
        var result = KruscoreCalculator.GradeWeight(400, 10);
        result.Should().BeApproximately(1.0, 0.001);
    }

    [Fact]
    public void GradeWeight_LargeDeviation_ReducesWeight()
    {
        var result = KruscoreCalculator.GradeWeight(600, 10);
        result.Should().BeLessThan(1.0);
        result.Should().Be(0.7);
    }

    // ── Performance Rating ────────────────────────────────────

    [Fact]
    public void PerformanceRating_Flash_ReturnsCorrectTheta()
    {
        // 5×6C Flash (S=0.9, weight=1, scale=50)
        // θ_i = 600 + 50 × (0.9 − 0.7) = 610
        // avg = 610

        var grades = new[] { 600.0, 600, 600, 600, 600 };
        var s = new[] { 0.9, 0.9, 0.9, 0.9, 0.9 };
        var w = new[] { 1, 1, 1, 1, 1 };
        var theta = KruscoreCalculator.PerformanceRating(grades, s, w);

        theta.Should().BeApproximately(610, 0.1);
    }

    [Fact]
    public void PerformanceRating_SkipsAttempt_ReturnsCorrectTheta()
    {
        // 3×6C Onsight (S=1.0, w=1) + 2×6C Attempt (S=0, skipped)
        // θ = 600 + 50×(1.0−0.7) = 615

        var grades = new[] { 600.0, 600, 600, 600, 600 };
        var s = new[] { 1.0, 1.0, 1.0, 0.0, 0.0 };
        var w = new[] { 1, 1, 1, 1, 1 };
        var theta = KruscoreCalculator.PerformanceRating(grades, s, w);

        theta.Should().BeApproximately(615, 0.1);
    }

    [Fact]
    public void PerformanceRating_LeadWeight_ReturnsCorrectTheta()
    {
        // 5× Lead Onsight 6C (S=1.0, w=3)
        // θ = 600 + 50×(1.0−0.7) = 615
        // weighted avg = 615

        var grades = new[] { 600.0, 600, 600, 600, 600 };
        var s = new[] { 1.0, 1.0, 1.0, 1.0, 1.0 };
        var w = new[] { 3, 3, 3, 3, 3 };
        var theta = KruscoreCalculator.PerformanceRating(grades, s, w);

        theta.Should().BeApproximately(615, 0.1);
    }

    [Fact]
    public void PerformanceRating_MixedTypes_ReturnsWeightedAvg()
    {
        // 3× Lead Onsight 6C (w=3) + 2× Bouldering Flash 5B (w=1)
        // Lead: θ = 600+50×(1.0−0.7) = 615
        // Flash: θ = 500+50×(0.9−0.7) = 510
        // weighted = (615×3×3 + 510×1×2) / (3×3+1×2) = 6555/11 ≈ 596

        var grades = new[] { 600.0, 600, 600, 500.0, 500 };
        var s = new[] { 1.0, 1.0, 1.0, 0.9, 0.9 };
        var w = new[] { 3, 3, 3, 1, 1 };
        var theta = KruscoreCalculator.PerformanceRating(grades, s, w);

        theta.Should().BeApproximately(596, 0.5);
    }

    // ── Repeat scenarios ──────────────────────────────────────

    [Fact]
    public void Repeat_BelowLevel_IsNeutral()
    {
        // θ=600, grade=500 (5C), E≈0.91, S=0.91 → surprise≈0
        var e = KruscoreCalculator.Expected(600, 500, 100);
        var s = KruscoreCalculator.GetRepeatS(e);
        (s - e).Should().BeApproximately(0, 0.001);
    }

    [Fact]
    public void Repeat_AtLevel_IsNeutral()
    {
        // θ=600, grade=600 (6C), E=0.5, S=0.5 → surprise=0
        var e = KruscoreCalculator.Expected(600, 600, 100);
        var s = KruscoreCalculator.GetRepeatS(e);
        (s - e).Should().BeApproximately(0, 0.001);
    }

    // ── Attempt scenarios ─────────────────────────────────────

    [Fact]
    public void Attempt_FarAboveLevel_NearlyZeroInfluence()
    {
        // θ=550, grade=640 (7A), E≈0.01 (scale=50)
        var e = KruscoreCalculator.Expected(550, 640, 50);
        var surprise = 0.0 - e;
        surprise.Should().BeApproximately(-0.01, 0.01);
    }

    [Fact]
    public void Attempt_FarBelowLevel_NegativeSurprise()
    {
        // θ=600, grade=500 (5C), E≈0.98 (scale=50)
        var e = KruscoreCalculator.Expected(600, 500, 50);
        var surprise = 0.0 - e;
        surprise.Should().BeLessThan(-0.9);
    }
}
