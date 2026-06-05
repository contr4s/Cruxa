using System.Text.Json;
using Cruxa.Domain.Common;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Common;

public class TimeOnlyJsonConverterTests
{
    private static readonly JsonSerializerOptions Options = new()
    {
        Converters = { new TimeOnlyJsonConverter() }
    };

    [Fact]
    public void Serialize_TimeOnly_ReturnsHHmmFormat()
    {
        var time = new TimeOnly(8, 0);
        var json = JsonSerializer.Serialize(time, Options);

        json.Should().Be("\"8:00\"");
    }

    [Fact]
    public void Serialize_TimeOnlyWithMinutes_ReturnsCorrectFormat()
    {
        var time = new TimeOnly(23, 30);
        var json = JsonSerializer.Serialize(time, Options);

        json.Should().Be("\"23:30\"");
    }

    [Fact]
    public void Serialize_TimeOnlyWithLeadingZero_OmitsLeadingZero()
    {
        var time = new TimeOnly(9, 5);
        var json = JsonSerializer.Serialize(time, Options);

        json.Should().Be("\"9:05\"");
    }

    [Fact]
    public void Deserialize_ValidString_ReturnsTimeOnly()
    {
        var json = "\"8:00\"";
        var result = JsonSerializer.Deserialize<TimeOnly>(json, Options);

        result.Should().Be(new TimeOnly(8, 0));
    }

    [Fact]
    public void Deserialize_ValidStringWithMinutes_ReturnsTimeOnly()
    {
        var json = "\"23:30\"";
        var result = JsonSerializer.Deserialize<TimeOnly>(json, Options);

        result.Should().Be(new TimeOnly(23, 30));
    }

    [Fact]
    public void Deserialize_EmptyString_ReturnsDefault()
    {
        var json = "\"\"";
        var result = JsonSerializer.Deserialize<TimeOnly>(json, Options);

        result.Should().Be(default(TimeOnly));
    }

    [Fact]
    public void SerializeDeserialize_RoundTrip_PreservesValue()
    {
        var original = new TimeOnly(14, 45);
        var json = JsonSerializer.Serialize(original, Options);
        var deserialized = JsonSerializer.Deserialize<TimeOnly>(json, Options);

        deserialized.Should().Be(original);
    }

    [Fact]
    public void Serialize_Midnight_ReturnsZero()
    {
        var time = new TimeOnly(0, 0);
        var json = JsonSerializer.Serialize(time, Options);

        json.Should().Be("\"0:00\"");
    }

    [Fact]
    public void Deserialize_Midnight_ReturnsTimeOnlyMinValue()
    {
        var json = "\"0:00\"";
        var result = JsonSerializer.Deserialize<TimeOnly>(json, Options);

        result.Should().Be(new TimeOnly(0, 0));
    }
}
