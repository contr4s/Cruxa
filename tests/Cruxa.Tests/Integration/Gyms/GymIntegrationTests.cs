using System.Net.Http.Json;
using Cruxa.Application.Features.Gyms.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Gyms;

public class GymIntegrationTests : IntegrationTestBase
{
    public GymIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task Create_WithValidData_ReturnsCreatedGym()
    {
        await SetupAdminAsync();
        var cmd = Fixture.Create<CreateGymCommand>();

        var response = await Client.PostAsJsonAsync("/api/gyms", cmd, JsonOptions);
        response.EnsureSuccessStatusCode();
        var gym = await DeserializeAsync<GymDto>(response);

        gym.Should().NotBeNull();
        gym.Name.Should().Be(cmd.Name);
        gym.City.Should().Be(cmd.City);
        gym.Address.Should().Be(cmd.Address);
        gym.Description.Should().Be(cmd.Description);
        gym.Id.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Create_ByRegularUser_ReturnsForbidden()
    {
        await ActAsNewUserAsync();

        var response = await Client.PostAsJsonAsync("/api/gyms", Fixture.Create<CreateGymCommand>(), JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Create_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.PostAsJsonAsync("/api/gyms", Fixture.Create<CreateGymCommand>(), JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetAll_ReturnsAllGyms()
    {
        await SetupAdminAsync();
        var gym1 = await CreateGymAsync();
        var gym2 = await CreateGymAsync();

        ClearToken();
        var response = await Client.GetAsync("/api/gyms");
        response.EnsureSuccessStatusCode();
        var allGyms = await DeserializeAsync<List<GymDto>>(response);

        allGyms.Should().NotBeEmpty();
        allGyms.Count.Should().BeGreaterThanOrEqualTo(2);
        allGyms.Should().Contain(g => g.Id == gym1.Id);
        allGyms.Should().Contain(g => g.Id == gym2.Id);
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsGym()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        ClearToken();
        var response = await Client.GetAsync($"/api/gyms/{gym.Id}");
        response.EnsureSuccessStatusCode();
        var found = await DeserializeAsync<GymDto>(response);

        found.Should().NotBeNull();
        found.Id.Should().Be(gym.Id);
        found.Name.Should().Be(gym.Name);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        var response = await Client.GetAsync($"/api/gyms/{Fixture.Create<Guid>()}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetByCity_ReturnsGymsInCity()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        ClearToken();
        var response = await Client.GetAsync($"/api/gyms/city/{gym.City}");
        response.EnsureSuccessStatusCode();
        var gyms = await DeserializeAsync<List<GymDto>>(response);

        gyms.Should().NotBeEmpty();
        gyms.All(g => g.City == gym.City).Should().BeTrue();
    }

    [Fact]
    public async Task Update_WithValidData_ReturnsUpdatedGym()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        var updatedCmd = Fixture.Create<CreateGymCommand>();
        var updateResponse = await Client.PutAsJsonAsync($"/api/gyms/{gym.Id}", updatedCmd, JsonOptions);

        updateResponse.EnsureSuccessStatusCode();
        var updated = await DeserializeAsync<GymDto>(updateResponse);

        updated.Should().NotBeNull();
        updated.Name.Should().Be(updatedCmd.Name);
        updated.Description.Should().Be(updatedCmd.Description);
    }

    [Fact]
    public async Task Delete_WithValidId_ReturnsNoContent()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        var deleteResponse = await Client.DeleteAsync($"/api/gyms/{gym.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);

        // Verify it's gone
        var getResponse = await Client.GetAsync($"/api/gyms/{gym.Id}");
        getResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Delete_ByNonAdmin_ReturnsForbidden()
    {
        // Setup admin to create a gym first
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        // Register a non-admin user
        await ActAsNewUserAsync();

        var deleteResponse = await Client.DeleteAsync($"/api/gyms/{gym.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }
}
