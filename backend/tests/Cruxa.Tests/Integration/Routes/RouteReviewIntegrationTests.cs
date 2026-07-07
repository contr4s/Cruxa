using System.Net.Http.Json;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Routes.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Routes;

public class RouteReviewIntegrationTests : IntegrationTestBase
{
    public RouteReviewIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    private async Task<Guid> CreateRouteAsync()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var route = await CreateRouteAsync(gym.Id);
        return route.Id;
    }

    [Fact]
    public async Task Add_WithValidData_ReturnsCreatedReview()
    {
        var routeId = await CreateRouteAsync();

        var cmd = Fixture.Create<AddRouteReviewCommand>();
        var response = await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", cmd, JsonOptions);

        response.EnsureSuccessStatusCode();
        var review = await DeserializeAsync<RouteReviewDto>(response);

        review.Should().NotBeNull();
        review.RouteId.Should().Be(routeId);
        review.Rating.Should().Be(cmd.Rating);
        review.PublicReview.Should().Be(cmd.PublicReview);
        review.PrivateNotes.Should().Be(cmd.PrivateNotes);
    }

    [Fact]
    public async Task Add_DuplicateReview_ReturnsBadRequest()
    {
        var routeId = await CreateRouteAsync();

        // First review
        var firstCmd = Fixture.Create<AddRouteReviewCommand>();
        var createResponse = await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", firstCmd, JsonOptions);
        createResponse.EnsureSuccessStatusCode();

        // Duplicate POST returns conflict
        var response = await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", Fixture.Create<AddRouteReviewCommand>(), JsonOptions);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetMyReview_ReturnsOwnReview()
    {
        var routeId = await CreateRouteAsync();

        var cmd = Fixture.Create<AddRouteReviewCommand>();
        await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", cmd, JsonOptions);

        var response = await Client.GetAsync($"/api/routes/{routeId}/reviews/my");
        response.EnsureSuccessStatusCode();
        var review = await DeserializeAsync<RouteReviewDto?>(response);

        review.Should().NotBeNull();
        review.Rating.Should().Be(cmd.Rating);
        review.PublicReview.Should().Be(cmd.PublicReview);
    }

    [Fact]
    public async Task GetMyReview_WithoutReview_ReturnsNull()
    {
        var routeId = await CreateRouteAsync();

        var response = await Client.GetAsync($"/api/routes/{routeId}/reviews/my");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task GetByRoute_ReturnsAllReviews()
    {
        var routeId = await CreateRouteAsync();

        await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", Fixture.Create<AddRouteReviewCommand>(), JsonOptions);

        // Add review by another user
        await ActAsNewUserAsync();
        await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", Fixture.Create<AddRouteReviewCommand>(), JsonOptions);

        ClearToken();
        var response = await Client.GetAsync($"/api/routes/{routeId}/reviews");
        response.EnsureSuccessStatusCode();
        var reviews = await DeserializeAsync<OffsetPaginatedList<RouteReviewDto>>(response);

        reviews.Items.Should().NotBeEmpty();
        reviews.Items.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task Update_WithValidData_ReturnsUpdatedReview()
    {
        var routeId = await CreateRouteAsync();

        var createResponse = await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", Fixture.Create<AddRouteReviewCommand>(), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<RouteReviewDto>(createResponse))!;

        var updateCmd = Fixture.Create<UpdateRouteReviewCommand>();
        var updateResponse = await Client.PutAsJsonAsync($"/api/routes/{routeId}/reviews/{created.Id}", updateCmd, JsonOptions);

        updateResponse.EnsureSuccessStatusCode();
        var updated = await DeserializeAsync<RouteReviewDto>(updateResponse);

        updated.Should().NotBeNull();
        updated.Rating.Should().Be(updateCmd.Rating);
        updated.PublicReview.Should().Be(updateCmd.PublicReview);
    }

    [Fact]
    public async Task Delete_WithValidId_ReturnsNoContent()
    {
        var routeId = await CreateRouteAsync();

        var createResponse = await Client.PostAsJsonAsync($"/api/routes/{routeId}/reviews", Fixture.Create<AddRouteReviewCommand>(), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<RouteReviewDto>(createResponse))!;

        var deleteResponse = await Client.DeleteAsync($"/api/routes/{routeId}/reviews/{created.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }
}
