using Cruxa.Domain.ValueObjects;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.ValueObjects;

public class GradeTests
{
    private readonly TestFixture _fixture = new();

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var raw = _fixture.Faker.PickRandom("4a", "4b", "4c", "5a", "5b", "5c", "6a", "6b", "6c", "7a", "7b", "7c", "8a");
        var index = _fixture.Faker.Random.Int(0, 1000);

        var result = Grade.Create(raw, index);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Raw.Should().Be(raw);
        result.Value.Index.Should().Be(index);
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Create_WithEmptyRaw_Throws(string? raw)
    {
        var act = () => Grade.Create(raw!, 1);
        act.Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(1001)]
    public void Create_WithInvalidIndex_Throws(int index)
    {
        var act = () => Grade.Create(_fixture.Faker.Lorem.Word(), index);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Create_WithBoundaryIndex_ReturnsSuccess()
    {
        var result = Grade.Create(_fixture.Faker.Lorem.Word(), 0);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Index.Should().Be(0);
    }

    [Fact]
    public void WithIndex_ReturnsNewGradeWithNewIndex()
    {
        var raw = _fixture.Faker.PickRandom("4a", "5a", "6a");
        var index = _fixture.Faker.Random.Int(0, 1000);
        var grade = Grade.Create(raw, index).Value!;

        var updated = grade.WithIndex(2);

        updated.Raw.Should().Be(raw);
        updated.Index.Should().Be(2);
        grade.Index.Should().Be(index); // original unchanged
    }

    [Fact]
    public void ToString_ReturnsRaw()
    {
        var raw = _fixture.Faker.PickRandom("4a", "5a", "6a");
        var grade = Grade.Create(raw, _fixture.Faker.Random.Int(0, 1000)).Value!;

        grade.ToString().Should().Be(raw);
    }

    [Fact]
    public void Equality_SameRawAndIndex_AreEqual()
    {
        var raw = _fixture.Faker.PickRandom("4a", "5a", "6a");
        var index = _fixture.Faker.Random.Int(0, 1000);
        var g1 = Grade.Create(raw, index).Value!;
        var g2 = Grade.Create(raw, index).Value!;

        g1.Should().Be(g2);
    }

    [Fact]
    public void Equality_DifferentRaw_AreNotEqual()
    {
        var g1 = Grade.Create("5a", 1).Value!;
        var g2 = Grade.Create("5b", 2).Value!;

        g1.Should().NotBe(g2);
    }
}
