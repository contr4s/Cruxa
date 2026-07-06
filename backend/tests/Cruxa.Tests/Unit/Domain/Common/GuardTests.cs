using Cruxa.Domain.Common;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Common;

public class GuardTests
{
    private readonly TestFixture _fixture = new();
    // ─── AgainstNull ───────────────────────────────────
    [Fact]
    public void AgainstNull_WithNull_Throws()
    {
        var act = () => Guard.AgainstNull(null, "param");
        act.Should().Throw<ArgumentNullException>().WithMessage("*param*");
    }

    [Fact]
    public void AgainstNull_WithValue_DoesNotThrow()
    {
        var act = () => Guard.AgainstNull(_fixture.Faker.Lorem.Word(), "param");
        act.Should().NotThrow();
    }

    // ─── AgainstNullOrEmpty ────────────────────────────
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void AgainstNullOrEmpty_WithInvalid_Throws(string? value)
    {
        var act = () => Guard.AgainstNullOrEmpty(value!, "param");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void AgainstNullOrEmpty_WithValue_DoesNotThrow()
    {
        var act = () => Guard.AgainstNullOrEmpty(_fixture.Faker.Lorem.Word(), "param");
        act.Should().NotThrow();
    }

    // ─── AgainstNullOrWhiteSpace ───────────────────────
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void AgainstNullOrWhiteSpace_WithInvalid_Throws(string? value)
    {
        var act = () => Guard.AgainstNullOrWhiteSpace(value!, "param");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void AgainstNullOrWhiteSpace_WithValue_DoesNotThrow()
    {
        var act = () => Guard.AgainstNullOrWhiteSpace(_fixture.Faker.Lorem.Word(), "param");
        act.Should().NotThrow();
    }

    // ─── AgainstOutOfRange (int) ──────────────────────
    [Theory]
    [InlineData(-1)]
    [InlineData(101)]
    public void AgainstOutOfRange_Int_OutOfRange_Throws(int value)
    {
        var act = () => Guard.AgainstOutOfRange(value, 0, 100, "param");
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void AgainstOutOfRange_Int_WithinRange_DoesNotThrow()
    {
        var value = _fixture.Faker.Random.Int(0, 100);
        var act = () => Guard.AgainstOutOfRange(value, 0, 100, "param");
        act.Should().NotThrow();
    }

    // ─── AgainstOutOfRange (double) ───────────────────
    [Theory]
    [InlineData(-91.0)]
    [InlineData(91.0)]
    public void AgainstOutOfRange_Double_OutOfRange_Throws(double value)
    {
        var act = () => Guard.AgainstOutOfRange(value, -90.0, 90.0, "param");
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void AgainstOutOfRange_Double_WithinRange_DoesNotThrow()
    {
        var value = _fixture.Faker.Random.Double(-90.0, 90.0);
        var act = () => Guard.AgainstOutOfRange(value, -90.0, 90.0, "param");
        act.Should().NotThrow();
    }

    // ─── AgainstDefault ──────────────────────────────
    [Fact]
    public void AgainstDefault_WithEmptyGuid_Throws()
    {
        var act = () => Guard.AgainstDefault(Guid.Empty, "param");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void AgainstDefault_WithNonEmptyGuid_DoesNotThrow()
    {
        var act = () => Guard.AgainstDefault(_fixture.Create<Guid>(), "param");
        act.Should().NotThrow();
    }
}
