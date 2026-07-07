using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Gyms.Handlers;
using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Cruxa.Application.Common.Interfaces;
using Moq;

namespace Cruxa.Tests.Unit.Application.Gyms;

public class GymHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IGymRepository> _gymRepo = new();

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
    public async Task GetGymById_WhenExists_ReturnsGym()
    {
        var gym = CreateGym();
        var id = Guid.NewGuid();
        var handler = new GetGymByIdHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(gym);

        var result = await handler.Handle(
            new GetGymByIdQuery(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Name.Should().Be(gym.Name);
    }

    [Fact]
    public async Task GetGymById_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new GetGymByIdHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Gym?)null);

        var result = await handler.Handle(
            new GetGymByIdQuery(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task UpdateGym_WhenExists_ReturnsSuccess()
    {
        var gym = CreateGym();
        var handler = new UpdateGymHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetByIdAsync(gym.Id)).ReturnsAsync(gym);

        var name = _fixture.Faker.Company.CompanyName();
        var cmd = _fixture.Create<UpdateGymCommand>() with { Id = gym.Id, Name = name };
        var result = await handler.Handle(cmd, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Name.Should().Be(name);
    }

    [Fact]
    public async Task UpdateGym_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new UpdateGymHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Gym?)null);

        var cmd = _fixture.Create<UpdateGymCommand>() with { Id = id };
        var result = await handler.Handle(cmd, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task DeleteGym_WhenExists_ReturnsSuccess()
    {
        var gym = CreateGym();
        var handler = new DeleteGymHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetByIdAsync(gym.Id)).ReturnsAsync(gym);

        var result = await handler.Handle(
            new DeleteGymCommand(Id: gym.Id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _gymRepo.Verify(r => r.DeleteAsync(gym.Id));
    }

    [Fact]
    public async Task DeleteGym_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new DeleteGymHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Gym?)null);

        var result = await handler.Handle(
            new DeleteGymCommand(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task GetAllGyms_ReturnsPaginatedList()
    {
        var gyms = new[] { CreateGym(), CreateGym(), CreateGym() };
        var handler = new GetAllGymsHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetAllPagedAsync(1, 2)).ReturnsAsync((gyms.Take(2).ToList(), 3));

        var result = await handler.Handle(new GetAllGymsQuery(1, 2), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().HaveCount(2);
        result.Value.TotalCount.Should().Be(3);
        result.Value.HasNextPage.Should().BeTrue();
        result.Value.HasPreviousPage.Should().BeFalse();
    }

    [Fact]
    public async Task GetGymsByCity_ReturnsPaginatedList()
    {
        var city = "TestCity";
        var gyms = new List<Gym> { CreateGym(), CreateGym() };
        // Force city value for test
        foreach (var g in gyms)
        {
            typeof(Gym).GetProperty("City")?.SetValue(g, city);
        }
        var handler = new GetGymsByCityHandler(_gymRepo.Object);
        _gymRepo.Setup(r => r.GetByCityPagedAsync(city, 1, 10)).ReturnsAsync((gyms, 2));

        var result = await handler.Handle(new GetGymsByCityQuery(city, 1, 10), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().HaveCount(2);
        result.Value.TotalCount.Should().Be(2);
    }
}
