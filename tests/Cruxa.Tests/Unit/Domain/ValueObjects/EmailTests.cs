using Cruxa.Domain.ValueObjects;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.ValueObjects;

public class EmailTests
{
    private readonly TestFixture _fixture = new();

    [Fact]
    public void Create_WithValidEmail_ReturnsSuccess()
    {
        var value = _fixture.Faker.Internet.Email();
        var result = Email.Create(value);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be(value.ToLowerInvariant());
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Create_WithEmptyValue_Throws(string? value)
    {
        var act = () => Email.Create(value!);
        act.Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("@domain.com")]
    [InlineData("user@")]
    [InlineData("user@.com")]
    [InlineData("user@domain")]
    public void Create_WithInvalidFormat_ReturnsFailure(string value)
    {
        var result = Email.Create(value);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void Create_TrimsAndLowercases()
    {
        var rawEmail = _fixture.Faker.Internet.Email();
        var result = Email.Create($"  {rawEmail}  ");

        result.IsSuccess.Should().BeTrue();
        result.Value!.Value.Should().Be(rawEmail.ToLowerInvariant());
    }

    [Fact]
    public void Create_WithTooLongEmail_ReturnsFailure()
    {
        var longEmail = new string('a', 321) + "@b.com";

        var result = Email.Create(longEmail);

        result.IsSuccess.Should().BeFalse();
    }

    [Fact]
    public void ImplicitConversion_ToString()
    {
        var rawEmail = _fixture.Faker.Internet.Email();
        var email = Email.Create(rawEmail).Value!;

        string value = email;

        value.Should().Be(rawEmail.ToLowerInvariant());
    }

    [Fact]
    public void Equality_SameEmail_AreEqual()
    {
        var rawEmail = _fixture.Faker.Internet.Email();
        var email1 = Email.Create(rawEmail).Value!;
        var email2 = Email.Create(rawEmail.ToUpperInvariant()).Value!;

        email1.Should().Be(email2);
    }
}
