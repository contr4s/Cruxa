using System.Net.Http.Json;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Social.Queries;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Social;

public class CommentIntegrationTests : IntegrationTestBase
{
    public CommentIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task Add_WithValidData_ReturnsCreatedComment()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        await ActAsNewUserAsync();

        var cmd = Fixture.Create<AddCommentCommand>();
        var response = await Client.PostAsJsonAsync($"/api/posts/{postId}/comments", cmd, JsonOptions);

        response.EnsureSuccessStatusCode();
        var comment = await DeserializeAsync<CommentDto>(response);

        comment.Should().NotBeNull();
        comment.Content.Should().Be(cmd.Content);
        comment.PostId.Should().Be(postId);
    }

    [Fact]
    public async Task Add_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.PostAsJsonAsync($"/api/posts/{Fixture.Create<Guid>()}/comments", new
        {
            content = Fixture.Faker.Lorem.Sentence()
        }, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetComments_ReturnsAllComments()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        // Add comment as first user
        await ActAsNewUserAsync();
        await Client.PostAsJsonAsync($"/api/posts/{postId}/comments", Fixture.Create<AddCommentCommand>(), JsonOptions);

        // Add comment as second user
        await ActAsNewUserAsync();
        await Client.PostAsJsonAsync($"/api/posts/{postId}/comments", Fixture.Create<AddCommentCommand>(), JsonOptions);

        ClearToken();
        var response = await Client.GetAsync($"/api/posts/{postId}/comments");
        response.EnsureSuccessStatusCode();
        var comments = await DeserializeAsync<OffsetPaginatedList<CommentDto>>(response);

        comments.Items.Should().NotBeEmpty();
        comments.Items.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task GetComments_WithNoComments_ReturnsEmpty()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        ClearToken();
        var response = await Client.GetAsync($"/api/posts/{postId}/comments");
        response.EnsureSuccessStatusCode();
        var comments = await DeserializeAsync<OffsetPaginatedList<CommentDto>>(response);

        comments.Items.Should().BeEmpty();
    }

    [Fact]
    public async Task GetComments_WithoutAuth_ReturnsOk()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        var response = await Client.GetAsync($"/api/posts/{postId}/comments");
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task Delete_OwnComment_ReturnsNoContent()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        await ActAsNewUserAsync();

        var createResponse = await Client.PostAsJsonAsync($"/api/posts/{postId}/comments", Fixture.Create<AddCommentCommand>(), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var comment = await DeserializeAsync<CommentDto>(createResponse);

        var deleteResponse = await Client.DeleteAsync($"/api/comments/{comment!.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_OthersComment_ReturnsBadRequest()
    {
        var postId = (await CreatePublishedPostAsync()).Id;

        // Add comment as another user
        await ActAsNewUserAsync();

        var createResponse = await Client.PostAsJsonAsync($"/api/posts/{postId}/comments", Fixture.Create<AddCommentCommand>(), JsonOptions);
        createResponse.EnsureSuccessStatusCode();
        var comment = await DeserializeAsync<CommentDto>(createResponse);

        // Try to delete as a different user
        await ActAsNewUserAsync();

        var deleteResponse = await Client.DeleteAsync($"/api/comments/{comment!.Id}");
        deleteResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }
}
