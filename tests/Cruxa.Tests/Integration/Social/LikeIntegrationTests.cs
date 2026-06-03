using FluentAssertions;

namespace Cruxa.Tests.Integration.Social;

public class LikeIntegrationTests : IntegrationTestBase
{
    public LikeIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task Like_WithValidId_ReturnsNoContent()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        // Like as a different user
        await ActAsNewUserAsync();

        var response = await Client.PostAsync($"/api/posts/{postId}/like", null);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Like_DuplicateLike_ReturnsBadRequest()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        await ActAsNewUserAsync();

        // First like
        await Client.PostAsync($"/api/posts/{postId}/like", null);

        // Second like (duplicate)
        var response = await Client.PostAsync($"/api/posts/{postId}/like", null);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Like_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.PostAsync($"/api/posts/{Fixture.Create<Guid>()}/like", null);
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Unlike_AfterLike_ReturnsNoContent()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        await ActAsNewUserAsync();

        await Client.PostAsync($"/api/posts/{postId}/like", null);
        var response = await Client.DeleteAsync($"/api/posts/{postId}/unlike");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Unlike_WithoutLike_ReturnsBadRequest()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        await ActAsNewUserAsync();

        var response = await Client.DeleteAsync($"/api/posts/{postId}/unlike");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task LikesCount_ReflectsTotalLikes()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        // First user likes
        await ActAsNewUserAsync();
        await Client.PostAsync($"/api/posts/{postId}/like", null);

        // Second user likes
        await ActAsNewUserAsync();
        await Client.PostAsync($"/api/posts/{postId}/like", null);

        // Check post has 2 likes
        ClearToken();
        var postResponse = await Client.GetAsync($"/api/posts/{postId}");
        postResponse.EnsureSuccessStatusCode();
        var post = await DeserializeAsync<PostDto>(postResponse);

        post.Should().NotBeNull();
        post.LikesCount.Should().Be(2);
    }
}
