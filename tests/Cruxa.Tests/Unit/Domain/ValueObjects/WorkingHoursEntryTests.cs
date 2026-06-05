using Cruxa.Domain.ValueObjects;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.ValueObjects;

public class WorkingHoursEntryTests
{
    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var result = WorkingHoursEntry.Create("Пн-Пт", new TimeOnly(8, 0), new TimeOnly(23, 0));

        result.IsSuccess.Should().BeTrue();
        result.Value!.Days.Should().Be("Пн-Пт");
        result.Value.From.Should().Be(new TimeOnly(8, 0));
        result.Value.To.Should().Be(new TimeOnly(23, 0));
    }

    [Fact]
    public void Create_WithSingleDay_ReturnsSuccess()
    {
        var result = WorkingHoursEntry.Create("Сб", new TimeOnly(10, 0), new TimeOnly(22, 0));

        result.IsSuccess.Should().BeTrue();
        result.Value!.Days.Should().Be("Сб");
        result.Value.From.Should().Be(new TimeOnly(10, 0));
        result.Value.To.Should().Be(new TimeOnly(22, 0));
    }

    [Fact]
    public void Create_WithЕжедневно_ReturnsSuccess()
    {
        var result = WorkingHoursEntry.Create("Ежедневно", new TimeOnly(9, 0), new TimeOnly(21, 30));

        result.IsSuccess.Should().BeTrue();
        result.Value!.Days.Should().Be("Ежедневно");
        result.Value.From.Should().Be(new TimeOnly(9, 0));
        result.Value.To.Should().Be(new TimeOnly(21, 30));
    }

    [Theory]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData(null)]
    public void Create_WithEmptyDays_ReturnsFailure(string? days)
    {
        var result = WorkingHoursEntry.Create(days!, new TimeOnly(8, 0), new TimeOnly(23, 0));

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void Create_WithMidnightToMidnight_ReturnsSuccess()
    {
        var result = WorkingHoursEntry.Create("Ежедневно", new TimeOnly(0, 0), new TimeOnly(23, 59));

        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void Create_WithFromEqualToTo_ReturnsFailure()
    {
        var result = WorkingHoursEntry.Create("Пн", new TimeOnly(10, 0), new TimeOnly(10, 0));

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void Create_WithFromAfterTo_ReturnsFailure()
    {
        var result = WorkingHoursEntry.Create("Пн", new TimeOnly(23, 0), new TimeOnly(8, 0));

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void Create_WithDayRange_ReturnsSuccess()
    {
        var result = WorkingHoursEntry.Create("Пн-Пт", new TimeOnly(8, 0), new TimeOnly(22, 0));

        result.IsSuccess.Should().BeTrue();
        result.Value!.Days.Should().Be("Пн-Пт");
    }

    [Fact]
    public void Create_WithWeekendDays_ReturnsSuccess()
    {
        var result = WorkingHoursEntry.Create("Сб-Вс", new TimeOnly(10, 0), new TimeOnly(20, 0));

        result.IsSuccess.Should().BeTrue();
        result.Value!.Days.Should().Be("Сб-Вс");
    }

    [Fact]
    public void Create_WithMultiDayList_ReturnsSuccess()
    {
        var result = WorkingHoursEntry.Create("Вт,Чт", new TimeOnly(17, 0), new TimeOnly(21, 0));

        result.IsSuccess.Should().BeTrue();
        result.Value!.Days.Should().Be("Вт,Чт");
    }
}
