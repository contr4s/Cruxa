using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Domain.ValueObjects;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Entities;

public class RouteTests
{
    private readonly TestFixture _fixture = new();
    private readonly Guid _gymId = Guid.NewGuid();

    private Route CreateRoute()
    {
        var raw = _fixture.Faker.PickRandom("4a", "4b", "4c", "5a", "5b", "5c", "6a", "6b", "6c", "7a", "7b", "7c", "8a");
        var grade = Grade.Create(raw, _fixture.Faker.Random.Int(0, 1000)).Value!;
        var result = Route.Create(_gymId, grade,
            _fixture.Create<RouteType>(), _fixture.Create<HoldColor>());
        return result.Value!;
    }

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var raw = _fixture.Faker.PickRandom("4a", "4b", "4c", "5a", "5b", "5c", "6a", "6b", "6c", "7a", "7b", "7c", "8a");
        var grade = Grade.Create(raw, _fixture.Faker.Random.Int(0, 1000)).Value!;
        var routeType = _fixture.Create<RouteType>();
        var holdColor = _fixture.Create<HoldColor>();
        var result = Route.Create(_gymId, grade, routeType, holdColor);

        result.IsSuccess.Should().BeTrue();
        result.Value!.GymId.Should().Be(_gymId);
        result.Value.Grade.Should().Be(grade);
        result.Value.Type.Should().Be(routeType);
        result.Value.HoldColor.Should().Be(holdColor);
        result.Value.IsActive.Should().BeTrue();
    }

    [Fact]
    public void Create_WithEmptyGymId_Throws()
    {
        var route = CreateRoute();
        var act = () => Route.Create(Guid.Empty, route.Grade, _fixture.Create<RouteType>(), _fixture.Create<HoldColor>());
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithNullGrade_Throws()
    {
        var act = () => Route.Create(_gymId, null!, _fixture.Create<RouteType>(), _fixture.Create<HoldColor>());
        act.Should().Throw<ArgumentNullException>();
    }

    [Fact]
    public void Deactivate_SetsIsActiveFalse()
    {
        var route = CreateRoute();

        route.Deactivate();

        route.IsActive.Should().BeFalse();
    }

    [Fact]
    public void Update_WithAllParams_UpdatesFields()
    {
        var route = CreateRoute();

        var type = _fixture.Create<RouteType>();
        var holdColor = _fixture.Create<HoldColor>();
        var sector = _fixture.Faker.Lorem.Word();
        var tag = Tag.CreateUnsafe("tag1");
        route.Update(type, holdColor, null, ["photo.jpg"],
            [tag], sector, false);

        route.Type.Should().Be(type);
        route.HoldColor.Should().Be(holdColor);
        route.PhotoUrls.Should().Contain("photo.jpg");
        route.Tags.Should().ContainSingle(t => t.Value == "tag1");
        route.Sector.Should().Be(sector);
        route.IsActive.Should().BeFalse();
    }

    [Fact]
    public void Update_Nullables_DoNotOverwrite()
    {
        var route = CreateRoute();
        var type = route.Type;
        var holdColor = route.HoldColor;

        route.Update(null, null, null, null, null, null, null);

        route.Type.Should().Be(type);
        route.IsActive.Should().BeTrue();
    }
}
