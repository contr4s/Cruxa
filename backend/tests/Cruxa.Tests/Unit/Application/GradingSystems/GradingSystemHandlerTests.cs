using Cruxa.Application.Features.GradingSystems.Commands;
using Cruxa.Application.Features.GradingSystems.Handlers;
using Cruxa.Application.Features.GradingSystems.Contracts;
using Cruxa.Application.Features.GradingSystems.Queries;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace Cruxa.Tests.Unit.Application.GradingSystems;

public class GradingSystemHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IGradingSystemRepository> _repo = new();

    private static GradingSystem CreateSystem(string? name = null)
    {
        var mapping = new Dictionary<string, int> { ["6a"] = 1, ["6a+"] = 2 };
        var result = GradingSystem.Create(name ?? "French", mapping);
        return result.Value!;
    }

    // --- GetAll ---

    [Fact]
    public async Task GetAll_ReturnsAllSystems()
    {
        var systems = new[] { CreateSystem("French"), CreateSystem("YDS") };
        _repo.Setup(r => r.GetAllAsync()).ReturnsAsync(systems);
        var handler = new GetAllGradingSystemsHandler(_repo.Object);

        var result = await handler.Handle(new GetAllGradingSystemsQuery(), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetAll_WhenEmpty_ReturnsEmpty()
    {
        _repo.Setup(r => r.GetAllAsync()).ReturnsAsync([]);
        var handler = new GetAllGradingSystemsHandler(_repo.Object);

        var result = await handler.Handle(new GetAllGradingSystemsQuery(), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEmpty();
    }

    // --- GetById ---

    [Fact]
    public async Task GetById_WhenExists_ReturnsSystem()
    {
        var system = CreateSystem();
        var id = Guid.NewGuid();
        _repo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(system);
        var handler = new GetGradingSystemByIdHandler(_repo.Object);

        var result = await handler.Handle(new GetGradingSystemByIdQuery(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Name.Should().Be(system.Name);
    }

    [Fact]
    public async Task GetById_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        _repo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((GradingSystem?)null);
        var handler = new GetGradingSystemByIdHandler(_repo.Object);

        var result = await handler.Handle(new GetGradingSystemByIdQuery(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    // --- GetByGymId ---

    [Fact]
    public async Task GetByGymId_WhenExists_ReturnsSystem()
    {
        var system = CreateSystem();
        var gymId = Guid.NewGuid();
        _repo.Setup(r => r.GetByGymIdAsync(gymId)).ReturnsAsync(system);
        var handler = new GetGradingSystemByGymIdHandler(_repo.Object);

        var result = await handler.Handle(
            new GetGradingSystemByGymIdQuery(GymId: gymId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Name.Should().Be(system.Name);
    }

    [Fact]
    public async Task GetByGymId_WhenNotExists_ReturnsNotFound()
    {
        var gymId = Guid.NewGuid();
        _repo.Setup(r => r.GetByGymIdAsync(gymId)).ReturnsAsync((GradingSystem?)null);
        var handler = new GetGradingSystemByGymIdHandler(_repo.Object);

        var result = await handler.Handle(
            new GetGradingSystemByGymIdQuery(GymId: gymId), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    // --- Create ---

    [Fact]
    public async Task Create_WithValidData_ReturnsCreatedSystem()
    {
        var handler = new CreateGradingSystemHandler(_repo.Object);

        var result = await handler.Handle(
            new CreateGradingSystemCommand("French", new Dictionary<string, int> { ["6a"] = 1 }),
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Name.Should().Be("French");
        _repo.Verify(r => r.AddAsync(It.IsAny<GradingSystem>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Create_WithEmptyName_ThrowsArgumentException()
    {
        var handler = new CreateGradingSystemHandler(_repo.Object);

        var act = async () => await handler.Handle(
            new CreateGradingSystemCommand("", new Dictionary<string, int> { ["6a"] = 1 }),
            CancellationToken.None);

        await act.Should().ThrowAsync<ArgumentException>();
        _repo.Verify(r => r.AddAsync(It.IsAny<GradingSystem>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    // --- Update ---

    [Fact]
    public async Task Update_WhenExists_UpdatesAndReturnsSystem()
    {
        var system = CreateSystem("French");
        var id = Guid.NewGuid();
        _repo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(system);
        var handler = new UpdateGradingSystemHandler(_repo.Object,
            Mock.Of<ILogger<UpdateGradingSystemHandler>>());

        var newMapping = new Dictionary<string, int> { ["7a"] = 3, ["7a+"] = 4 };
        var result = await handler.Handle(
            new UpdateGradingSystemCommand(Id: id, Name: "French Updated", GradeMapping: newMapping),
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Name.Should().Be("French Updated");
    }

    [Fact]
    public async Task Update_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        _repo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((GradingSystem?)null);
        var handler = new UpdateGradingSystemHandler(_repo.Object,
            Mock.Of<ILogger<UpdateGradingSystemHandler>>());

        var result = await handler.Handle(
            new UpdateGradingSystemCommand(Id: id, Name: "Test", GradeMapping: new Dictionary<string, int> { ["6a"] = 1 }),
            CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    // --- Delete ---

    [Fact]
    public async Task Delete_WhenExists_RemovesAndSaves()
    {
        var system = CreateSystem();
        var id = Guid.NewGuid();
        _repo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(system);
        var handler = new DeleteGradingSystemHandler(_repo.Object);

        var result = await handler.Handle(new DeleteGradingSystemCommand(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _repo.Verify(r => r.Remove(system), Times.Once);
    }

    [Fact]
    public async Task Delete_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        _repo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((GradingSystem?)null);
        var handler = new DeleteGradingSystemHandler(_repo.Object);

        var result = await handler.Handle(new DeleteGradingSystemCommand(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
        _repo.Verify(r => r.Remove(It.IsAny<GradingSystem>()), Times.Never);
    }
}
