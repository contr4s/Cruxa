using Cruxa.Domain.Entities;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Entities;

public class TagTests
{
    [Fact]
    public void Create_WithValidValue_ReturnsSuccess()
    {
        var result = Tag.Create("bouldering");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be("bouldering");
    }

    [Fact]
    public void Create_NormalizesValueToLowercase()
    {
        var result = Tag.Create("Bouldering");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be("bouldering");
    }

    [Fact]
    public void Create_TrimsValue()
    {
        var result = Tag.Create("  bouldering  ");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be("bouldering");
    }

    [Fact]
    public void Create_WithCategory_SetsCategory()
    {
        var result = Tag.Create("bouldering", "style");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be("bouldering");
        result.Value.Category.Should().Be("style");
    }

    [Fact]
    public void Create_WithCategory_NormalizesCategory()
    {
        var result = Tag.Create("bouldering", "Style");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Category.Should().Be("style");
    }

    [Fact]
    public void Create_WithEmptyValue_Throws()
    {
        var act = () => Tag.Create("");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithNullValue_Throws()
    {
        var act = () => Tag.Create(null!);

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithWhitespaceValue_Throws()
    {
        var act = () => Tag.Create("   ");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithTooLongValue_ReturnsValidationError()
    {
        var result = Tag.Create(new string('a', 51));

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void Create_WithInvalidCharacters_ReturnsValidationError()
    {
        var result = Tag.Create("tag with $ymbols");

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void Create_WithValidSpecialCharacters_ReturnsSuccess()
    {
        var result = Tag.Create("overhang+#");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be("overhang+#");
    }

    [Fact]
    public void Create_WithUnicodeLetters_ReturnsSuccess()
    {
        var result = Tag.Create("скалолазание");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be("скалолазание");
    }

    [Fact]
    public void ToString_WithoutCategory_ReturnsValue()
    {
        var tag = Tag.Create("bouldering").Value!;

        tag.ToString().Should().Be("bouldering");
    }

    [Fact]
    public void ToString_WithCategory_ReturnsCategoryColonValue()
    {
        var tag = Tag.Create("bouldering", "style").Value!;

        tag.ToString().Should().Be("style:bouldering");
    }

    [Fact]
    public void CreateUnsafe_SetsValueDirectly()
    {
        var tag = Tag.CreateUnsafe("MyTag");

        tag.Value.Should().Be("MyTag");
    }

    [Fact]
    public void CreateUnsafe_WithId_SetsId()
    {
        var id = Guid.NewGuid();
        var tag = Tag.CreateUnsafe(id, "mytag");

        tag.Id.Should().Be(id);
        tag.Value.Should().Be("mytag");
    }
}
