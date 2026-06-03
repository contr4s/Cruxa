using Cruxa.Domain.ValueObjects;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.ValueObjects;

public class GeoCoordinateTests
{
    private readonly TestFixture _fixture = new();

    [Fact]
    public void Create_WithValidCoordinates_ReturnsSuccess()
    {
        var lat = _fixture.Faker.Address.Latitude();
        var lon = _fixture.Faker.Address.Longitude();

        var result = GeoCoordinate.Create(lat, lon);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Latitude.Should().Be(lat);
        result.Value.Longitude.Should().Be(lon);
    }

    [Theory]
    [InlineData(-91, 0)]
    [InlineData(91, 0)]
    [InlineData(0, -181)]
    [InlineData(0, 181)]
    public void Create_WithInvalidCoordinates_ReturnsFailure(double lat, double lon)
    {
        var result = GeoCoordinate.Create(lat, lon);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Theory]
    [InlineData(-90, 0)]
    [InlineData(90, 0)]
    [InlineData(0, -180)]
    [InlineData(0, 180)]
    public void Create_WithBoundaryCoordinates_ReturnsSuccess(double lat, double lon)
    {
        var result = GeoCoordinate.Create(lat, lon);

        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void DistanceTo_ReturnsZero_ForSamePoint()
    {
        var coord = GeoCoordinate.Create(
            _fixture.Faker.Address.Latitude(),
            _fixture.Faker.Address.Longitude()).Value!;

        var distance = coord.DistanceTo(coord);

        distance.Should().BeApproximately(0, 0.01);
    }

    [Fact]
    public void DistanceTo_MoscowToSpb_ReturnsReasonableDistance()
    {
        var moscow = GeoCoordinate.Create(55.7558, 37.6173).Value!;
        var spb = GeoCoordinate.Create(59.9343, 30.3351).Value!;

        var distance = moscow.DistanceTo(spb);

        // ~635 km between Moscow and St. Petersburg center
        distance.Should().BeInRange(600, 700);
    }

    [Fact]
    public void DistanceTo_NyToLa_ReturnsReasonableDistance()
    {
        var ny = GeoCoordinate.Create(40.7128, -74.0060).Value!;
        var la = GeoCoordinate.Create(34.0522, -118.2437).Value!;

        var distance = ny.DistanceTo(la);

        // ~3940 km between NYC and LA
        distance.Should().BeInRange(3800, 4100);
    }

    [Fact]
    public void Equality_SameCoordinates_AreEqual()
    {
        var c1 = GeoCoordinate.Create(55.0, 37.0).Value!;
        var c2 = GeoCoordinate.Create(55.0, 37.0).Value!;

        c1.Should().Be(c2);
    }
}
