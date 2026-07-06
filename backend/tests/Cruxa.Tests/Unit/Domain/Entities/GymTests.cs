using Cruxa.Domain.Entities;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Entities;

public class GymTests
{
    private readonly TestFixture _fixture = new();

    private Gym CreateGym()
    {
        var result = Gym.Create(
            _fixture.Faker.Company.CompanyName(),
            _fixture.Faker.Address.City(),
            _fixture.Faker.Address.StreetAddress(),
            _fixture.Faker.Address.Latitude(),
            _fixture.Faker.Address.Longitude());
        return result.Value!;
    }

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var name = _fixture.Faker.Company.CompanyName();
        var city = _fixture.Faker.Address.City();
        var address = _fixture.Faker.Address.StreetAddress();
        var lat = _fixture.Faker.Address.Latitude();
        var lon = _fixture.Faker.Address.Longitude();

        var result = Gym.Create(name, city, address, lat, lon);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Name.Should().Be(name.Trim());
        result.Value.City.Should().Be(city.Trim());
        result.Value.Address.Should().Be(address.Trim());
        result.Value.Location!.Latitude.Should().Be(lat);
        result.Value.Location!.Longitude.Should().Be(lon);
    }

    [Fact]
    public void Create_WithEmptyName_Throws()
    {
        var act = () => Gym.Create("", _fixture.Faker.Address.City(),
            _fixture.Faker.Address.StreetAddress(),
            _fixture.Faker.Address.Latitude(),
            _fixture.Faker.Address.Longitude());
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithInvalidCoordinates_ReturnsFailure()
    {
        var result = Gym.Create(
            _fixture.Faker.Company.CompanyName(),
            _fixture.Faker.Address.City(),
            _fixture.Faker.Address.StreetAddress(),
            100.0, _fixture.Faker.Address.Longitude());

        result.IsSuccess.Should().BeFalse();
    }

    [Fact]
    public void Update_ModifiesFields()
    {
        var gym = CreateGym();

        var name = _fixture.Faker.Company.CompanyName();
        var city = _fixture.Faker.Address.City();
        var prices = new List<Cruxa.Domain.ValueObjects.PriceItem>
        {
            new() { Name = "Разовое", Price = "500 руб" }
        };
        gym.Update(name: name, city: city, prices: prices);

        gym.Name.Should().Be(name);
        gym.City.Should().Be(city);
        gym.Prices.Should().BeEquivalentTo(prices);
    }

    [Fact]
    public void Update_WithEmptyName_Throws()
    {
        var gym = CreateGym();

        var act = () => gym.Update(name: "");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Update_WithNulls_DoesNotChange()
    {
        var gym = CreateGym();
        var name = gym.Name;
        var city = gym.City;

        gym.Update();

        gym.Name.Should().Be(name);
        gym.City.Should().Be(city);
    }

    [Fact]
    public void Update_WithNewLocation_UpdatesCoordinates()
    {
        var gym = CreateGym();

        var lat = _fixture.Faker.Random.Double(-90, 90);
        var lon = _fixture.Faker.Random.Double(-180, 180);
        gym.Update(latitude: lat, longitude: lon);

        gym.Location!.Latitude.Should().Be(lat);
        gym.Location!.Longitude.Should().Be(lon);
    }
}
