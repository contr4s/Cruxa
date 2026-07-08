using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Application.Features.Gyms.Handlers;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Gyms;

public class BulkImportGymsHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IGymRepository> _gymRepo = new();
    private readonly Mock<ITransactionManager> _txManager = new();
    private readonly BulkImportGymsHandler _handler;

    public BulkImportGymsHandlerTests()
    {
        var mockTx = new Mock<ITransaction>();
        _txManager.Setup(x => x.BeginTransactionAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockTx.Object);

        _handler = new BulkImportGymsHandler(_gymRepo.Object, _txManager.Object);
    }

    [Fact]
    public async Task Handle_WithValidGyms_ReturnsImportedCount()
    {
        // Arrange
        var gyms = _fixture.CreateMany<ImportGymDto>(2).ToList();

        _gymRepo.Setup(r => r.ExistsByNameAndCityAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(false);

        // Act
        var result = await _handler.Handle(new BulkImportGymsCommand(gyms), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.Imported.Should().Be(2);
        result.Value.Skipped.Should().Be(0);
        result.Value.Errors.Should().BeEmpty();
        _gymRepo.Verify(r => r.AddRangeAsync(It.Is<List<Gym>>(list => list.Count == 2)), Times.Once);
        _txManager.Verify(x => x.BeginTransactionAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithDuplicateGyms_SkipsDuplicates()
    {
        // Arrange — use fixture data for the duplicate pair, but ensure same key
        var first = _fixture.Create<ImportGymDto>();
        var gyms = new List<ImportGymDto>
        {
            first,
            new()  // manually copy only Name+City to create a duplicate
            {
                Name = first.Name,
                City = first.City,
                Address = _fixture.Faker.Address.StreetAddress(),
                Latitude = _fixture.Faker.Address.Latitude(),
                Longitude = _fixture.Faker.Address.Longitude()
            }
        };

        _gymRepo.Setup(r => r.ExistsByNameAndCityAsync(first.Name, first.City))
            .ReturnsAsync(true);

        // Act
        var result = await _handler.Handle(new BulkImportGymsCommand(gyms), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.Imported.Should().Be(0);
        result.Value.Skipped.Should().Be(2);
    }

    [Fact]
    public async Task Handle_WithMissingRequiredFields_ReturnsErrors()
    {
        // Arrange
        var gyms = _fixture.CreateMany<ImportGymDto>(3).ToList();
        gyms[0].Name = "";       // empty name
        gyms[1].City = "";       // empty city
        gyms[2].Address = "";    // empty address

        // Act
        var result = await _handler.Handle(new BulkImportGymsCommand(gyms), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.Imported.Should().Be(0);
        result.Value.Skipped.Should().Be(3);
        result.Value.Errors.Should().HaveCount(3);
    }

    [Fact]
    public async Task Handle_WithEmptyList_ReturnsSuccessWithZeroCounts()
    {
        // Act
        var result = await _handler.Handle(new BulkImportGymsCommand([]), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.Imported.Should().Be(0);
        result.Value.Skipped.Should().Be(0);
    }

    [Fact]
    public async Task Handle_WithMoreThan500Gyms_ReturnsValidationError()
    {
        // Arrange
        var gyms = _fixture.CreateMany<ImportGymDto>(501).ToList();

        // Act
        var result = await _handler.Handle(new BulkImportGymsCommand(gyms), CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public async Task Handle_WithAllValidGyms_SetsIsParsedTrue()
    {
        // Arrange
        var dto = _fixture.Create<ImportGymDto>();
        var gyms = new List<ImportGymDto> { dto };

        _gymRepo.Setup(r => r.ExistsByNameAndCityAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(false);

        List<Gym>? capturedGyms = null;
        _gymRepo.Setup(r => r.AddRangeAsync(It.IsAny<List<Gym>>()))
            .Callback<List<Gym>>(g => capturedGyms = g);

        // Act
        var result = await _handler.Handle(new BulkImportGymsCommand(gyms), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        capturedGyms.Should().NotBeNull();
        capturedGyms!.Count.Should().Be(1);
        capturedGyms[0].IsParsed.Should().BeTrue();
        capturedGyms[0].Name.Should().Be(dto.Name);
        capturedGyms[0].City.Should().Be(dto.City);
    }

    [Fact]
    public async Task Handle_WithInvalidCoordinates_ReturnsError()
    {
        // Arrange
        var dto = _fixture.Create<ImportGymDto>();
        dto.Latitude = 100.0; // Invalid (> 90)
        var gyms = new List<ImportGymDto> { dto };

        // Act
        var result = await _handler.Handle(new BulkImportGymsCommand(gyms), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.Imported.Should().Be(0);
        result.Value.Skipped.Should().Be(1);
        result.Value.Errors.Should().Contain(e => e.Contains(dto.Name));
    }
}
