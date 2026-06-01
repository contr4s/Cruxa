namespace Cruxa.Tests.Unit.Application;

using Cruxa.Application.Services;
using FluentAssertions;

public class GradeMappingServiceTests
{
    private readonly IGradeMappingService _service = new GradeMappingService();

    [Fact]
    public void CalculateGradeIndex_WithValidGrade_ReturnsCorrectIndex()
    {
        var mapping = """{ "5a": 460, "5b": 480, "5c": 500 }""";

        var result = _service.CalculateGradeIndex("5a", mapping);

        result.Should().Be(460);
    }

    [Fact]
    public void CalculateGradeIndex_WithCaseInsensitiveGrade_ReturnsCorrectIndex()
    {
        var mapping = """{ "6A": 520, "6B": 560 }""";

        var result = _service.CalculateGradeIndex("6a", mapping);

        result.Should().Be(520);
    }

    [Fact]
    public void CalculateGradeIndex_WithInvalidGrade_ThrowsArgumentException()
    {
        var mapping = """{ "5a": 460 }""";

        Action act = () => _service.CalculateGradeIndex("7a", mapping);

        act.Should().Throw<ArgumentException>()
           .WithMessage("Grade '7a' not found in mapping");
    }

    [Fact]
    public void CalculateGradeIndex_WithEmptyMapping_ThrowsArgumentException()
    {
        Action act = () => _service.CalculateGradeIndex("5a", "");

        act.Should().Throw<ArgumentException>()
           .WithMessage("Grade mapping is empty");
    }
}
