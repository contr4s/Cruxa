using System.Net.Http.Json;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Users.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Users;

public class UserIntegrationTests : IntegrationTestBase
{
    public UserIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task GetById_WithValidId_ReturnsUser()
    {
        var auth = await ActAsNewUserAsync();

        var response = await Client.GetAsync($"/api/users/{auth.User.Id}");
        response.EnsureSuccessStatusCode();
        var user = await DeserializeAsync<UserDto>(response);

        user.Should().NotBeNull();
        user.Id.Should().Be(auth.User.Id);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ReturnsNotFound()
    {
        await ActAsNewUserAsync();

        var response = await Client.GetAsync($"/api/users/{Fixture.Create<Guid>()}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetById_WithoutAuth_ReturnsUnauthorized()
    {
        var response = await Client.GetAsync($"/api/users/{Fixture.Create<Guid>()}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetByUsername_WithValidUsername_ReturnsUser()
    {
        var cmd = Fixture.Create<RegisterCommand>();
        var regResponse = await Client.PostAsJsonAsync("/api/auth/register", cmd, JsonOptions);
        var auth = (await DeserializeAsync<AuthResponse>(regResponse))!;
        SetToken(auth.Token);

        var response = await Client.GetAsync($"/api/users/username/{cmd.Username}");
        response.EnsureSuccessStatusCode();
        var user = await DeserializeAsync<UserDto>(response);

        user.Should().NotBeNull();
        user.Username.Should().Be(cmd.Username);
    }

    [Fact]
    public async Task GetByUsername_WithInvalidUsername_ReturnsNotFound()
    {
        await ActAsNewUserAsync();

        var response = await Client.GetAsync("/api/users/username/nonexistent");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetAll_ByAdmin_ReturnsAllUsers()
    {
        // Register a regular user first
        await ActAsNewUserAsync();
        ClearToken();

        // Promote to admin and get token
        await SetupAdminAsync();

        var response = await Client.GetAsync("/api/users");
        response.EnsureSuccessStatusCode();
        var users = await DeserializeAsync<List<UserDto>>(response);

        users.Should().NotBeEmpty();
        users.Count.Should().BeGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task GetAll_ByNonAdmin_ReturnsForbidden()
    {
        await ActAsNewUserAsync();

        var response = await Client.GetAsync("/api/users");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Update_WithValidData_ReturnsUpdatedUser()
    {
        var auth = await ActAsNewUserAsync();
        var cmd = Fixture.Create<UpdateUserCommand>();

        var response = await Client.PutAsJsonAsync($"/api/users/{auth.User.Id}", cmd, JsonOptions);

        response.EnsureSuccessStatusCode();
        var updated = await DeserializeAsync<UserDto>(response);

        updated.Should().NotBeNull();
        updated.City.Should().Be(cmd.City);
        updated.AvatarUrl.Should().Be(cmd.AvatarUrl);
    }

    [Fact]
    public async Task Delete_Self_ReturnsNoContent()
    {
        var auth = await ActAsNewUserAsync();

        var response = await Client.DeleteAsync($"/api/users/{auth.User.Id}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Delete_OtherUser_ReturnsNotFound()
    {
        var auth = await ActAsNewUserAsync();
        var otherId = Guid.NewGuid();

        var response = await Client.DeleteAsync($"/api/users/{otherId}");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.NotFound);
    }
}
