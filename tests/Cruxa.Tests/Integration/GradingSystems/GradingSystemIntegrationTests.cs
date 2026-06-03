using System.Net.Http.Json;
using Cruxa.Application.Features.Gyms.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.GradingSystems;

public class GradingSystemIntegrationTests : IntegrationTestBase
{
    public GradingSystemIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task GetAll_ReturnsGradingSystems()
    {
        var response = await Client.GetAsync("/api/grading-systems");
        response.EnsureSuccessStatusCode();
        var systems = await DeserializeAsync<List<GradingSystemDto>>(response);

        systems.Should().NotBeEmpty();
        systems.Should().AllSatisfy(s =>
        {
            s.Id.Should().NotBeEmpty();
            s.Name.Should().NotBeNullOrEmpty();
            s.GradeMapping.Should().NotBeEmpty();
        });
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsSystem()
    {
        // Get all first to find an ID
        var allResponse = await Client.GetAsync("/api/grading-systems");
        allResponse.EnsureSuccessStatusCode();
        var all = await DeserializeAsync<List<GradingSystemDto>>(allResponse);
        var firstId = all!.First().Id;

        var response = await Client.GetAsync($"/api/grading-systems/{firstId}");
        response.EnsureSuccessStatusCode();
        var system = await DeserializeAsync<GradingSystemDto>(response);

        system.Should().NotBeNull();
        system.Id.Should().Be(firstId);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        var response = await Client.GetAsync($"/api/grading-systems/{Fixture.Create<Guid>()}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetByGymId_WithExistingGym_ReturnsGradingSystem()
    {
        await SetupAdminAsync();

        // Get the default grading system to pass to the gym
        var allGsResponse = await Client.GetAsync("/api/grading-systems");
        var allGs = await DeserializeAsync<List<GradingSystemDto>>(allGsResponse);
        var gsId = allGs!.First().Id;

        var gymCmd = Fixture.Create<CreateGymCommand>() with { GradingSystemId = gsId };
        var gymResponse = await Client.PostAsJsonAsync("/api/gyms", gymCmd, JsonOptions);
        gymResponse.EnsureSuccessStatusCode();
        var gym = await DeserializeAsync<GymDto>(gymResponse);

        ClearToken();
        var response = await Client.GetAsync($"/api/grading-systems/gym/{gym!.Id}");
        response.EnsureSuccessStatusCode();
        var system = await DeserializeAsync<GradingSystemDto>(response);

        system.Should().NotBeNull();
        system.Id.Should().Be(gsId);
    }

    [Fact]
    public async Task GetByGymId_WithInvalidId_ReturnsNotFound()
    {
        var response = await Client.GetAsync($"/api/grading-systems/gym/{Fixture.Create<Guid>()}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }
}
