using System.Net.Http.Json;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Enums;
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
            Style = AscentStyle.Onsight
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
        var ascents = await DeserializeAsync<OffsetPaginatedList<AscentDto>>(response);

        ascents.Should().NotBeNull();
        ascents.Items.Should().NotBeEmpty();
        ascents.Items[0].RouteId.Should().Be(routeId);
        ascents.Items[0].Style.Should().Be(cmd.Style);
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
        var ascents = await DeserializeAsync<OffsetPaginatedList<AscentDto>>(response);

        ascents.Should().NotBeNull();
        ascents.Items.Should().NotBeEmpty();
        ascents.Items.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task Remove_WithValidId_ReturnsNoContent()
    {
        var (postId, routeId, _) = await SetupAsync();

        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", Fixture.Create<AddAscentCommand>() with { RouteId = routeId }, JsonOptions);

        // Get ascents to find the ID
        var getResponse = await Client.GetAsync($"/api/posts/{postId}/ascents");
        var ascents = await DeserializeAsync<OffsetPaginatedList<AscentDto>>(getResponse);

        var deleteResponse = await Client.DeleteAsync($"/api/posts/{postId}/ascents/{ascents!.Items[0].Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Update_WithValidData_ReturnsUpdatedAscent()
    {
        var (postId, routeId, _) = await SetupAsync();

        // Add ascent first
        var addCmd = Fixture.Create<AddAscentCommand>() with { RouteId = routeId, Style = AscentStyle.Onsight };
        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", addCmd, JsonOptions);

        // Get ascents to find the ID
        var getResponse = await Client.GetAsync($"/api/posts/{postId}/ascents");
        var ascents = await DeserializeAsync<OffsetPaginatedList<AscentDto>>(getResponse);

        // Update ascent style
        var updateCmd = new { Style = AscentStyle.Flash, MediaUrls = new List<string> { "https://example.com/photo.jpg" } };
        var updateResponse = await Client.PutAsJsonAsync($"/api/posts/{postId}/ascents/{ascents!.Items[0].Id}", updateCmd, JsonOptions);
        updateResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        var updated = await DeserializeAsync<AscentDto>(updateResponse);
        updated!.Style.Should().Be(AscentStyle.Flash);
        updated.MediaUrls.Should().Contain("https://example.com/photo.jpg");
    }

    [Fact]
    public async Task Update_ByDifferentUser_ReturnsBadRequest()
    {
        var (postId, routeId, _) = await SetupAsync();

        var addCmd = Fixture.Create<AddAscentCommand>() with { RouteId = routeId };
        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", addCmd, JsonOptions);

        // Login as a different user
        await ActAsNewUserAsync();

        var getResponse = await Client.GetAsync($"/api/posts/{postId}/ascents");
        var ascents = await DeserializeAsync<OffsetPaginatedList<AscentDto>>(getResponse);

        var updateResponse = await Client.PutAsJsonAsync($"/api/posts/{postId}/ascents/{ascents!.Items[0].Id}",
            new { Style = AscentStyle.Flash }, JsonOptions);
        updateResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetByUser_ReturnsUserAscents()
    {
        var (postId, routeId, _) = await SetupAsync();
        var userId = CurrentUserId;

        // Add a couple of ascents
        var cmd = Fixture.Create<AddAscentCommand>() with { RouteId = routeId };
        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", cmd, JsonOptions);

        ClearToken();
        var response = await Client.GetAsync($"/api/ascents/user/{userId}");
        response.EnsureSuccessStatusCode();
        var result = await DeserializeAsync<OffsetPaginatedList<AscentDto>>(response);

        result.Should().NotBeNull();
        result.Items.Should().NotBeEmpty();
        result.Items.Should().AllSatisfy(a => a.Style.Should().Be(cmd.Style));
    }

    [Fact]
    public async Task GetByUser_ReturnsPaginatedList()
    {
        var (postId, routeId, _) = await SetupAsync();
        var userId = CurrentUserId;

        // Add ascent
        var cmd = Fixture.Create<AddAscentCommand>() with { RouteId = routeId };
        await Client.PostAsJsonAsync($"/api/posts/{postId}/ascents", cmd, JsonOptions);

        ClearToken();
        var response = await Client.GetAsync($"/api/ascents/user/{userId}?page=1&pageSize=10");
        response.EnsureSuccessStatusCode();
        var result = await DeserializeAsync<OffsetPaginatedList<AscentDto>>(response);

        result.Should().NotBeNull();
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
        result.Items.Should().NotBeEmpty();
    }
}
