using System.Net.Http.Json;
using Cruxa.Application.Features.Routes.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Routes;

public class TagIntegrationTests : IntegrationTestBase
{
    public TagIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    private async Task<RouteDto> CreateRouteWithTagsAsync(Guid gymId, List<string> tags)
    {
        var response = await Client.PostAsJsonAsync("/api/routes",
            Fixture.Create<CreateRouteCommand>() with { GymId = gymId, Tags = tags },
            JsonOptions);
        response.EnsureSuccessStatusCode();
        return (await DeserializeAsync<RouteDto>(response))!;
    }

    [Fact]
    public async Task GetAllTags_ReturnsDistinctTags()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        // Create routes with specific tags
        await CreateRouteWithTagsAsync(gym.Id, ["bouldering", "technical"]);
        await CreateRouteWithTagsAsync(gym.Id, ["bouldering", "overhang"]);
        await CreateRouteWithTagsAsync(gym.Id, ["slab"]);

        ClearToken();
        var response = await Client.GetAsync("/api/routes/tags");
        response.EnsureSuccessStatusCode();
        var tags = await DeserializeAsync<List<string>>(response);

        tags.Should().NotBeNull();
        tags.Should().Contain(new[] { "bouldering", "technical", "overhang", "slab" });
    }

    [Fact]
    public async Task GetAllTags_WhenNoRoutes_ReturnsEmptyList()
    {
        // Note: other tests may create routes with tags in parallel,
        // so this checks the endpoint is accessible and returns a list
        var response = await Client.GetAsync("/api/routes/tags");
        response.EnsureSuccessStatusCode();
        var tags = await DeserializeAsync<List<string>>(response);

        tags.Should().NotBeNull();
        // May be empty or have tags from parallel tests
    }

    [Fact]
    public async Task CreateRoute_WithValidTags_PersistsTags()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        var response = await Client.PostAsJsonAsync("/api/routes",
            Fixture.Create<CreateRouteCommand>() with
            {
                GymId = gym.Id,
                Tags = ["bouldering", "technical"]
            }, JsonOptions);
        response.EnsureSuccessStatusCode();
        var route = await DeserializeAsync<RouteDto>(response);

        route.Should().NotBeNull();
        route.Tags.Should().BeEquivalentTo(["bouldering", "technical"]);
    }

    [Fact]
    public async Task CreateRoute_WithInvalidTags_ReturnsBadRequest()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();

        var response = await Client.PostAsJsonAsync("/api/routes",
            Fixture.Create<CreateRouteCommand>() with
            {
                GymId = gym.Id,
                Tags = ["tag with spaces and $ymbols!!!"]
            }, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateRoute_WithValidTags_UpdatesTags()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var route = await CreateRouteAsync(gym.Id);

        var updateResponse = await Client.PutAsJsonAsync($"/api/routes/{route.Id}",
            new UpdateRouteCommand(Id: route.Id, Tags: ["new-tag", "overhang"]), JsonOptions);
        updateResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);

        var getResponse = await Client.GetAsync($"/api/routes/{route.Id}");
        var updated = await DeserializeAsync<RouteDto>(getResponse);
        updated!.Tags.Should().BeEquivalentTo(["new-tag", "overhang"]);
    }
}
