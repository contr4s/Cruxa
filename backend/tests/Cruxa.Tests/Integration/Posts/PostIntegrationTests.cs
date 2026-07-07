using System.Net.Http.Json;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Posts.DTOs;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Enums;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Posts;

public class PostIntegrationTests : IntegrationTestBase
{
    public PostIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    private async Task<GymDto> SetupGymAsync()
    {
        await SetupAdminAsync();
        return await CreateGymAsync();
    }

    [Fact]
    public async Task Create_AsDraft_ReturnsPostWithDraftStatus()
    {
        var gym = await SetupGymAsync();
        var request = MakePostRequest(gym.Id);

        var response = await Client.PostAsJsonAsync("/api/posts", request, JsonOptions);

        response.EnsureSuccessStatusCode();
        var post = await DeserializeAsync<PostDto>(response);

        post.Should().NotBeNull();
        post.Description.Should().Be(request.Description);
        post.MediaUrls.Should().BeEquivalentTo(request.MediaUrls);
        post.Status.Should().Be(PostStatus.Draft);
        post.GymId.Should().Be(gym.Id);
    }

    [Fact]
    public async Task Create_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.PostAsJsonAsync("/api/posts", new
        {
            gymId = Fixture.Create<Guid>(),
            description = Fixture.Faker.Lorem.Sentence(),
            visibility = Fixture.Faker.PickRandom<PostVisibility>().ToString()
        }, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetById_WithValidId_ReturnsPost()
    {
        var gym = await SetupGymAsync();
        var createResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<PostDto>(createResponse))!;

        ClearToken();
        var response = await Client.GetAsync($"/api/posts/{created.Id}");
        response.EnsureSuccessStatusCode();
        var found = await DeserializeAsync<PostDto>(response);

        found.Should().NotBeNull();
        found.Id.Should().Be(created.Id);
        found.Description.Should().Be(created.Description);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        var response = await Client.GetAsync($"/api/posts/{Fixture.Create<Guid>()}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetByUser_ReturnsUsersPosts()
    {
        var gym = await SetupGymAsync();
        var createResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<PostDto>(createResponse))!;

        ClearToken();
        var response = await Client.GetAsync($"/api/posts/user/{created.UserId}");
        response.EnsureSuccessStatusCode();
        var posts = await DeserializeAsync<OffsetPaginatedList<PostDto>>(response);

        posts.Items.Should().NotBeEmpty();
        posts.Items.Should().Contain(p => p.Id == created.Id);
    }

    [Fact]
    public async Task GetByGym_ReturnsPostsForGym()
    {
        var gym = await SetupGymAsync();
        await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);

        ClearToken();
        var response = await Client.GetAsync($"/api/posts/gym/{gym.Id}");
        response.EnsureSuccessStatusCode();
        var posts = await DeserializeAsync<List<PostDto>>(response);

        posts.Should().NotBeEmpty();
        posts.All(p => p.GymId == gym.Id).Should().BeTrue();
    }

    [Fact]
    public async Task Update_WithValidData_ReturnsUpdatedPost()
    {
        var gym = await SetupGymAsync();
        var createResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<PostDto>(createResponse))!;

        var updateRequest = MakePostRequest(gym.Id);
        var updateResponse = await Client.PutAsJsonAsync($"/api/posts/{created.Id}", updateRequest, JsonOptions);

        updateResponse.EnsureSuccessStatusCode();
        var updated = await DeserializeAsync<PostDto>(updateResponse);

        updated.Should().NotBeNull();
        updated.Description.Should().Be(updateRequest.Description);
        updated.MediaUrls.Should().BeEquivalentTo(updateRequest.MediaUrls);
    }

    [Fact]
    public async Task Publish_WithDraftPost_ReturnsNoContent()
    {
        var gym = await SetupGymAsync();
        var createResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<PostDto>(createResponse))!;

        var publishResponse = await Client.PutAsync($"/api/posts/{created.Id}/publish", null);
        publishResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_WithValidId_ReturnsNoContent()
    {
        var gym = await SetupGymAsync();
        var createResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<PostDto>(createResponse))!;

        var deleteResponse = await Client.DeleteAsync($"/api/posts/{created.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_ByAnotherUser_ReturnsBadRequest()
    {
        var gym = await SetupGymAsync();
        var createResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<PostDto>(createResponse))!;

        // Try to delete as another user
        await ActAsNewUserAsync();

        var deleteResponse = await Client.DeleteAsync($"/api/posts/{created.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetFeed_ReturnsPosts()
    {
        var gym = await SetupGymAsync();

        // Create a post
        var createResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var created = (await DeserializeAsync<PostDto>(createResponse))!;

        // Publish it
        await Client.PutAsync($"/api/posts/{created.Id}/publish", null);

        var feedResponse = await Client.GetAsync("/api/posts/feed");
        feedResponse.EnsureSuccessStatusCode();
        var feed = await DeserializeAsync<OffsetPaginatedList<PostDto>>(feedResponse);

        feed.Should().NotBeNull();
        feed.Items.Should().NotBeEmpty();
    }
}
