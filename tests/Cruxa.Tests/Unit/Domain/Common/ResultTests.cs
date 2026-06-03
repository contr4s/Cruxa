using Cruxa.Domain.Common;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Common;

public class ResultTests
{
    private readonly TestFixture _fixture = new();
    [Fact]
    public void Success_NonGeneric_ReturnsIsSuccess()
    {
        var result = Result.Success();

        result.IsSuccess.Should().BeTrue();
        result.IsFailure.Should().BeFalse();
    }

    [Fact]
    public void Failure_NonGeneric_ReturnsIsFailure()
    {
        var result = Result.Failure(Error.NotFound("Item"));

        result.IsSuccess.Should().BeFalse();
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public void Success_Generic_ReturnsValue()
    {
        var value = _fixture.Faker.Random.Int();
        var result = Result.Success(value);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(value);
    }

    [Fact]
    public void Failure_Generic_ReturnsDefaultValue()
    {
        var result = Result.Failure<int>(Error.NotFound("Item"));

        result.IsSuccess.Should().BeFalse();
        result.Value.Should().Be(0);
    }

    [Fact]
    public void ImplicitConversion_FromValue_ReturnsSuccess()
    {
        var value = _fixture.Faker.Lorem.Word();
        Result<string> result = value;

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(value);
    }

    [Fact]
    public void ImplicitConversion_FromError_ReturnsFailure()
    {
        Result<string> result = Error.NotFound("Item");

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }
}
