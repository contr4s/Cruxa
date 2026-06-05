using System.Net.Http.Json;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Application.Features.Gyms.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Gyms;

public class GymImportIntegrationTests : IntegrationTestBase
{
    public GymImportIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task BulkImport_WithValidGyms_ReturnsImportedCount()
    {
        await SetupAdminAsync();

        var command = new BulkImportGymsCommand(Fixture.CreateMany<ImportGymDto>(2).ToList());

        var response = await Client.PostAsJsonAsync("/api/gyms/import", command, JsonOptions);
        response.EnsureSuccessStatusCode();
        var result = await DeserializeAsync<BulkImportResult>(response);

        result.Should().NotBeNull();
        result.Imported.Should().Be(2);
        result.Skipped.Should().Be(0);
        result.Errors.Should().BeEmpty();
    }

    [Fact]
    public async Task BulkImport_DuplicateGyms_SkipsExisting()
    {
        await SetupAdminAsync();

        var first = Fixture.Create<ImportGymDto>();

        // First import
        var firstCommand = new BulkImportGymsCommand([first]);
        var firstResponse = await Client.PostAsJsonAsync("/api/gyms/import", firstCommand, JsonOptions);
        firstResponse.EnsureSuccessStatusCode();
        var firstResult = await DeserializeAsync<BulkImportResult>(firstResponse);
        firstResult!.Imported.Should().Be(1);

        // Second import with the same gym (manual duplicate with same Name+City)
        var secondCommand = new BulkImportGymsCommand([
            new ImportGymDto
            {
                Name = first.Name,
                City = first.City,
                Address = first.Address,
                Latitude = first.Latitude,
                Longitude = first.Longitude
            }
        ]);
        var secondResponse = await Client.PostAsJsonAsync("/api/gyms/import", secondCommand, JsonOptions);
        secondResponse.EnsureSuccessStatusCode();
        var secondResult = await DeserializeAsync<BulkImportResult>(secondResponse);

        secondResult.Should().NotBeNull();
        secondResult.Imported.Should().Be(0);
        secondResult.Skipped.Should().Be(1);
    }

    [Fact]
    public async Task BulkImport_WithInvalidGyms_ReturnsErrors()
    {
        await SetupAdminAsync();

        var dto = Fixture.Create<ImportGymDto>();
        dto.Name = "";  // Empty name
        var command = new BulkImportGymsCommand([dto]);

        var response = await Client.PostAsJsonAsync("/api/gyms/import", command, JsonOptions);
        response.EnsureSuccessStatusCode();
        var result = await DeserializeAsync<BulkImportResult>(response);

        result.Should().NotBeNull();
        result.Imported.Should().Be(0);
        result.Skipped.Should().Be(1);
        result.Errors.Should().Contain(e => e.Contains("Name"));
    }

    [Fact]
    public async Task BulkImport_ByNonAdmin_ReturnsForbidden()
    {
        await ActAsNewUserAsync();

        var command = new BulkImportGymsCommand([Fixture.Create<ImportGymDto>()]);

        var response = await Client.PostAsJsonAsync("/api/gyms/import", command, JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task BulkImport_WithoutAuth_ReturnsUnauthorized()
    {
        var command = new BulkImportGymsCommand([Fixture.Create<ImportGymDto>()]);

        var response = await Client.PostAsJsonAsync("/api/gyms/import", command, JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task BulkImport_EmptyList_ReturnsBadRequest()
    {
        await SetupAdminAsync();

        var command = new BulkImportGymsCommand([]);

        var response = await Client.PostAsJsonAsync("/api/gyms/import", command, JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task BulkImport_ImportedGyms_HaveIsParsedTrue()
    {
        await SetupAdminAsync();

        var dto = Fixture.Create<ImportGymDto>();
        var command = new BulkImportGymsCommand([dto]);

        var importResponse = await Client.PostAsJsonAsync("/api/gyms/import", command, JsonOptions);
        importResponse.EnsureSuccessStatusCode();

        // Fetch the gym by name via city endpoint
        var getResponse = await Client.GetAsync($"/api/gyms/city/{dto.City}");
        getResponse.EnsureSuccessStatusCode();
        var gyms = await DeserializeAsync<OffsetPaginatedList<GymDto>>(getResponse);

        gyms.Should().NotBeNull();
        var parsedGym = gyms.Items.FirstOrDefault(g => g.Name == dto.Name);
        parsedGym.Should().NotBeNull();
        parsedGym.IsParsed.Should().BeTrue();
    }
}
