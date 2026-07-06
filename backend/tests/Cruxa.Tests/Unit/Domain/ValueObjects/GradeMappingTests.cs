using Cruxa.Domain.ValueObjects;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.ValueObjects;

public class GradeMappingTests
{
    private readonly TestFixture _fixture = new();
    private readonly Dictionary<string, int> _validMap = new()
    {
        ["5a"] = 1,
        ["5b"] = 2,
        ["5c"] = 3,
        ["6a"] = 4,
        ["6b"] = 5
    };

    [Fact]
    public void Create_WithValidMap_ReturnsSuccess()
    {
        var result = GradeMapping.Create(_validMap);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Mapping.Should().ContainKeys(_validMap.Keys);
    }

    [Fact]
    public void Create_WithNullMap_Throws()
    {
        var act = () => GradeMapping.Create(null!);
        act.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void Create_WithEmptyMap_ReturnsFailure()
    {
        var result = GradeMapping.Create(new Dictionary<string, int>());

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void Create_WithOutOfRangeIndex_ReturnsFailure()
    {
        var bad = new Dictionary<string, int> { ["test"] = 1001 };
        var result = GradeMapping.Create(bad);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void ResolveIndex_ExistingGrade_ReturnsIndex()
    {
        var mapping = GradeMapping.Create(_validMap).Value!;

        var result = mapping.ResolveIndex("5a");

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(1);
    }

    [Fact]
    public void ResolveIndex_NonExistingGrade_ReturnsFailure()
    {
        var mapping = GradeMapping.Create(_validMap).Value!;

        var result = mapping.ResolveIndex(_fixture.Faker.Lorem.Word());

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void ResolveIndex_IsCaseInsensitive()
    {
        var mapping = GradeMapping.Create(_validMap).Value!;

        var result = mapping.ResolveIndex("5A");

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(1);
    }

    [Fact]
    public void ResolveGrade_ReturnsGradeObject()
    {
        var mapping = GradeMapping.Create(_validMap).Value!;

        var result = mapping.ResolveGrade("6a");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Raw.Should().Be("6a");
        result.Value.Index.Should().Be(4);
    }

    [Fact]
    public void Equals_SameMaps_AreEqual()
    {
        var m1 = GradeMapping.Create(_validMap).Value!;
        var m2 = GradeMapping.Create(_validMap).Value!;

        m1.Should().Be(m2);
    }
}
