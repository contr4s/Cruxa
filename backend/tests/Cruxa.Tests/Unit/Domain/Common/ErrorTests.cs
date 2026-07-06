using Cruxa.Domain.Common;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Common;

public class ErrorTests
{
    private readonly TestFixture _fixture = new();

    [Fact]
    public void None_ReturnsDefault()
    {
        Error.None.Code.Should().Be("None");
        Error.None.Message.Should().BeEmpty();
    }

    [Fact]
    public void NotFound_CreatesError()
    {
        var error = Error.NotFound("User");

        error.Code.Should().Be("NotFound");
        error.Message.Should().Contain("User");
    }

    [Fact]
    public void Conflict_CreatesError()
    {
        var error = Error.Conflict("Already exists");

        error.Code.Should().Be("Conflict");
        error.Message.Should().Be("Already exists");
    }

    [Fact]
    public void Validation_CreatesError()
    {
        var error = Error.Validation("Invalid value");

        error.Code.Should().Be("Validation");
        error.Message.Should().Be("Invalid value");
    }

    [Fact]
    public void Unauthorized_CreatesError()
    {
        var error = Error.Unauthorized("Access denied");

        error.Code.Should().Be("Unauthorized");
        error.Message.Should().Be("Access denied");
    }

    [Fact]
    public void Duplicate_ReturnsDuplicateError()
    {
        Error.Duplicate.Code.Should().Be("Duplicate");
    }

    [Fact]
    public void ToString_FormatsCorrectly()
    {
        var error = Error.NotFound("User", "123");

        error.ToString().Should().Be("[NotFound] User not found. Args: 123");
    }

    [Fact]
    public void Equality_SameCodeAndMessage_AreEqual()
    {
        var code = _fixture.Faker.Lorem.Word();
        var message = _fixture.Faker.Lorem.Sentence();
        var e1 = new Error(code, message);
        var e2 = new Error(code, message);

        e1.Should().Be(e2);
    }
}
