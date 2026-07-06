using FluentAssertions;

namespace Cruxa.Tests.Integration.Social;

public class FollowerIntegrationTests : IntegrationTestBase
{
    public FollowerIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task Follow_WithValidId_ReturnsNoContent()
    {
        var target = await ActAsNewUserAsync();
        ClearToken();

        await ActAsNewUserAsync();

        var response = await Client.PostAsync($"/api/users/{target.User.Id}/follow", null);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Follow_Self_ReturnsBadRequest()
    {
        var auth = await ActAsNewUserAsync();

        var response = await Client.PostAsync($"/api/users/{auth.User.Id}/follow", null);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Follow_Duplicate_ReturnsBadRequest()
    {
        var target = await ActAsNewUserAsync();
        ClearToken();

        await ActAsNewUserAsync();

        // First follow
        await Client.PostAsync($"/api/users/{target.User.Id}/follow", null);

        // Duplicate follow
        var response = await Client.PostAsync($"/api/users/{target.User.Id}/follow", null);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Follow_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.PostAsync($"/api/users/{Fixture.Create<Guid>()}/follow", null);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Unfollow_AfterFollow_ReturnsNoContent()
    {
        var target = await ActAsNewUserAsync();
        ClearToken();

        await ActAsNewUserAsync();

        await Client.PostAsync($"/api/users/{target.User.Id}/follow", null);
        var response = await Client.DeleteAsync($"/api/users/{target.User.Id}/follow");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Unfollow_WithoutFollow_ReturnsBadRequest()
    {
        var target = await ActAsNewUserAsync();
        ClearToken();

        await ActAsNewUserAsync();

        var response = await Client.DeleteAsync($"/api/users/{target.User.Id}/follow");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetFollowers_ReturnsListOfFollowerIds()
    {
        var target = await ActAsNewUserAsync();
        ClearToken();

        // Follower follows the target
        var follower = await ActAsNewUserAsync();
        await Client.PostAsync($"/api/users/{target.User.Id}/follow", null);

        ClearToken();
        var response = await Client.GetAsync($"/api/users/{target.User.Id}/followers");
        response.EnsureSuccessStatusCode();
        var followers = await DeserializeAsync<List<Guid>>(response);

        followers.Should().NotBeEmpty();
        followers.Should().Contain(follower.User.Id);
    }

    [Fact]
    public async Task GetFollowing_ReturnsListOfFolloweeIds()
    {
        var target1 = await ActAsNewUserAsync();
        ClearToken();
        var target2 = await ActAsNewUserAsync();
        ClearToken();

        // User follows both targets
        var mainAuth = await ActAsNewUserAsync();

        await Client.PostAsync($"/api/users/{target1.User.Id}/follow", null);
        await Client.PostAsync($"/api/users/{target2.User.Id}/follow", null);

        ClearToken();
        var followingResponse = await Client.GetAsync($"/api/users/{mainAuth.User.Id}/following");
        followingResponse.EnsureSuccessStatusCode();
        var following = await DeserializeAsync<List<Guid>>(followingResponse);

        following.Should().NotBeEmpty();
        following.Should().Contain(target1.User.Id);
        following.Should().Contain(target2.User.Id);
    }

    [Fact]
    public async Task IsFollowing_AfterFollow_ReturnsTrue()
    {
        var target = await ActAsNewUserAsync();
        ClearToken();

        await ActAsNewUserAsync();
        await Client.PostAsync($"/api/users/{target.User.Id}/follow", null);

        var response = await Client.GetAsync($"/api/users/{target.User.Id}/is-following");
        response.EnsureSuccessStatusCode();
        var isFollowing = await DeserializeAsync<bool>(response);

        isFollowing.Should().BeTrue();
    }

    [Fact]
    public async Task IsFollowing_WithoutFollow_ReturnsFalse()
    {
        var target = await ActAsNewUserAsync();
        ClearToken();

        await ActAsNewUserAsync();

        var response = await Client.GetAsync($"/api/users/{target.User.Id}/is-following");
        response.EnsureSuccessStatusCode();
        var isFollowing = await DeserializeAsync<bool>(response);

        isFollowing.Should().BeFalse();
    }

    [Fact]
    public async Task IsFollowing_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.GetAsync($"/api/users/{Fixture.Create<Guid>()}/is-following");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }
}
