using System.Net.Http.Json;
using Cruxa.Application.Features.Routes.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Routes;

public class RouteIntegrationTests : IntegrationTestBase
{
    public RouteIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task Create_WithValidData_ReturnsCreatedRoute()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var route = await CreateRouteAsync(gym.Id);

        route.Should().NotBeNull();
        route.GymId.Should().Be(gym.Id);
        route.IsActive.Should().BeTrue();
    }

    [Fact]
    public async Task Create_ByRegularUser_ReturnsForbidden()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        await ActAsNewUserAsync();

        var response = await Client.PostAsJsonAsync("/api/routes", Fixture.Create<CreateRouteCommand>() with { GymId = gym.Id }, JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Create_WithoutAuth_ReturnsUnauthorized()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        ClearToken();
        var response = await Client.PostAsJsonAsync("/api/routes", Fixture.Create<CreateRouteCommand>() with { GymId = gym.Id }, JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetAll_ReturnsAllRoutes()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        await CreateRouteAsync(gym.Id);

        ClearToken();
        var response = await Client.GetAsync("/api/routes");
        response.EnsureSuccessStatusCode();
        var routes = await DeserializeAsync<List<RouteDto>>(response);

        routes.Should().NotBeEmpty();
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsRoute()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var created = await CreateRouteAsync(gym.Id);

        ClearToken();
        var response = await Client.GetAsync($"/api/routes/{created.Id}");
        response.EnsureSuccessStatusCode();
        var found = await DeserializeAsync<RouteDto>(response);

        found.Should().NotBeNull();
        found.Id.Should().Be(created.Id);
        found.GradeRaw.Should().Be(created.GradeRaw);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        var response = await Client.GetAsync($"/api/routes/{Fixture.Create<Guid>()}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetByGym_ReturnsRoutesForGym()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        await CreateRouteAsync(gym.Id);

        ClearToken();
        var response = await Client.GetAsync($"/api/routes/gym/{gym.Id}");
        response.EnsureSuccessStatusCode();
        var routes = await DeserializeAsync<List<RouteDto>>(response);

        routes.Should().NotBeEmpty();
        routes.All(r => r.GymId == gym.Id).Should().BeTrue();
    }

    [Fact]
    public async Task Update_WithValidData_ReturnsNoContent()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var route = await CreateRouteAsync(gym.Id);

        var updateCmd = Fixture.Create<UpdateRouteCommand>();
        var updateResponse = await Client.PutAsJsonAsync($"/api/routes/{route.Id}", updateCmd);
        updateResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_ByGymAdmin_ReturnsNoContent()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var route = await CreateRouteAsync(gym.Id);

        var deleteResponse = await Client.DeleteAsync($"/api/routes/{route.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_ByRegularUser_ReturnsForbidden()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var route = await CreateRouteAsync(gym.Id);

        await ActAsNewUserAsync();

        var deleteResponse = await Client.DeleteAsync($"/api/routes/{route.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }


}
