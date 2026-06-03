using Cruxa.Application.Features.Routes.Handlers;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Domain.ValueObjects;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Routes;

public class RouteHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IRouteRepository> _routeRepo = new();

    private Route CreateRoute()
    {
        var grade = Grade.Create(
            _fixture.Faker.PickRandom("5a", "6a", "7a"),
            _fixture.Faker.Random.Int(0, 1000)).Value!;
        var result = Route.Create(Guid.NewGuid(), grade,
            _fixture.Create<RouteType>(), _fixture.Create<HoldColor>());
        return result.Value!;
    }

    [Fact]
    public async Task GetRouteById_WhenExists_ReturnsRoute()
    {
        var route = CreateRoute();
        var id = route.Id;
        var handler = new GetRouteByIdHandler(_routeRepo.Object);
        _routeRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(route);

        var result = await handler.Handle(
            new GetRouteByIdQuery(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Id.Should().Be(id);
        result.Value.GradeRaw.Should().Be(route.Grade?.Raw);
        result.Value.Type.Should().Be(route.Type);
        result.Value.HoldColor.Should().Be(route.HoldColor);
    }

    [Fact]
    public async Task GetRouteById_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new GetRouteByIdHandler(_routeRepo.Object);
        _routeRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Route?)null);

        var result = await handler.Handle(
            new GetRouteByIdQuery(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task UpdateRoute_WhenExists_ReturnsSuccess()
    {
        var route = CreateRoute();
        var handler = new UpdateRouteHandler(_routeRepo.Object);
        _routeRepo.Setup(r => r.GetByIdAsync(route.Id)).ReturnsAsync(route);

        var result = await handler.Handle(
            _fixture.Create<UpdateRouteCommand>() with { Id = route.Id, IsActive = false },
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _routeRepo.Verify(r => r.UpdateAsync(route));
    }

    [Fact]
    public async Task UpdateRoute_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new UpdateRouteHandler(_routeRepo.Object);
        _routeRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Route?)null);

        var result = await handler.Handle(
            _fixture.Create<UpdateRouteCommand>() with { Id = id }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task DeleteRoute_WhenExists_ReturnsSuccess()
    {
        var route = CreateRoute();
        var handler = new DeleteRouteHandler(_routeRepo.Object);
        _routeRepo.Setup(r => r.GetByIdAsync(route.Id)).ReturnsAsync(route);

        var result = await handler.Handle(
            new DeleteRouteCommand(Id: route.Id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _routeRepo.Verify(r => r.DeleteAsync(route.Id));
    }

    [Fact]
    public async Task DeleteRoute_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new DeleteRouteHandler(_routeRepo.Object);
        _routeRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Route?)null);

        var result = await handler.Handle(
            new DeleteRouteCommand(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }
}
