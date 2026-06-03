using System.Net.Http.Json;
using Cruxa.Application.Features.Ascents.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Ascents;

public class AscentIntegrationTests(CruxaApiFactory factory) : IntegrationTestBase(factory)
{
    private async Task<(Guid PostId, Guid RouteId, Guid GymId)> SetupAsync()
    {
        await SetupAdminAsync();

        var gym = await CreateGymAsync();

        var route = await CreateRouteAsync(gym.Id);

        // Create post
        var postResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        postResponse.EnsureSuccessStatusCode();
        var post = (await DeserializeAsync<PostDto>(postResponse))!;

        return (post.Id, route.Id, gym.Id);
    }

    [Fact]
    public async Task Add_WithValidData_ReturnsCreated()
    {
        var (postId, routeId, _) = await SetupAsync();

        var cmd = Fixture.Create<AddAscentCommand>() with { RouteId = routeId };
        var response = await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", cmd, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Created);
    }

    [Fact]
    public async Task Add_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.PostAsJsonAsync($"/api/posts/{Fixture.Create<Guid>()}/ascents", new
        {
            routeId = Fixture.Create<Guid>(),
            style = "Onsight"
        }, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetByPost_ReturnsAscents()
    {
        var (postId, routeId, _) = await SetupAsync();

        var cmd = Fixture.Create<AddAscentCommand>() with { RouteId = routeId };
        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", cmd, JsonOptions);

        ClearToken();
        var response = await Client.GetAsync($"/api/posts/{postId}/ascents");
        response.EnsureSuccessStatusCode();
        var ascents = await DeserializeAsync<List<AscentDto>>(response);

        ascents.Should().NotBeEmpty();
        ascents[0].RouteId.Should().Be(routeId);
        ascents[0].Style.Should().Be(cmd.Style);
    }

    [Fact]
    public async Task Add_MultipleAscents_ReturnsAll()
    {
        var (postId, routeId, gymId) = await SetupAsync();

        // Add first ascent
        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", Fixture.Create<AddAscentCommand>() with { RouteId = routeId }, JsonOptions);

        // Create a second route for another ascent
        var route2 = await CreateRouteAsync(gymId);

        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", Fixture.Create<AddAscentCommand>() with { RouteId = route2.Id }, JsonOptions);

        ClearToken();
        var response = await Client.GetAsync($"/api/posts/{postId}/ascents");
        response.EnsureSuccessStatusCode();
        var ascents = await DeserializeAsync<List<AscentDto>>(response);

        ascents.Should().NotBeEmpty();
        ascents.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task Remove_WithValidId_ReturnsNoContent()
    {
        var (postId, routeId, _) = await SetupAsync();

        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", Fixture.Create<AddAscentCommand>() with { RouteId = routeId }, JsonOptions);

        // Get ascents to find the ID
        var getResponse = await Client.GetAsync($"/api/posts/{postId}/ascents");
        var ascents = await DeserializeAsync<List<AscentDto>>(getResponse);

        var deleteResponse = await Client.DeleteAsync($"/api/posts/{postId}/ascents/{ascents![0].Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }
}
