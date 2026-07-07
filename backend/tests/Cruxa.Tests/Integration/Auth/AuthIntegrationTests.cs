using System.Net.Http.Json;
using Cruxa.Application.Features.Auth.DTOs;
using FluentAssertions;

namespace Cruxa.Tests.Integration.Auth;

public class AuthIntegrationTests : IntegrationTestBase
{
    public AuthIntegrationTests(CruxaApiFactory factory) : base(factory) { }

    [Fact]
    public async Task Register_WithValidData_ReturnsTokenAndUser()
    {
        var cmd = Fixture.Create<RegisterCommand>();

        var response = await Client.PostAsJsonAsync("/api/auth/register", cmd, JsonOptions);
        var auth = await DeserializeAsync<AuthResponse>(response);

        auth.Should().NotBeNull();
        auth.Token.Should().NotBeNullOrEmpty();
        auth.User.Username.Should().Be(cmd.Username);
        auth.User.Email.Should().Be(cmd.Email.ToLowerInvariant());
        auth.User.DisplayName.Should().NotBeNullOrEmpty();
        auth.User.Role.Should().Be("Climber");
    }

    [Fact]
    public async Task Register_DuplicateEmail_ReturnsConflict()
    {
        var original = Fixture.Create<RegisterCommand>();
        await Client.PostAsJsonAsync("/api/auth/register", original, JsonOptions);

        var duplicate = Fixture.Create<RegisterCommand>() with { Email = original.Email };
        var response  = await Client.PostAsJsonAsync("/api/auth/register", duplicate, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Register_InvalidEmail_ReturnsBadRequest()
    {
        var cmd = Fixture.Create<RegisterCommand>() with { Email = Fixture.Create<string>() };
        var response = await Client.PostAsJsonAsync("/api/auth/register", cmd, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Register_ShortPassword_ReturnsBadRequest()
    {
        var cmd = Fixture.Create<RegisterCommand>() with { Password = Fixture.Faker.Internet.Password(5) };
        var response = await Client.PostAsJsonAsync("/api/auth/register", cmd, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        var cmd = Fixture.Create<RegisterCommand>();
        var registerResponse = await Client.PostAsJsonAsync("/api/auth/register", cmd, JsonOptions);
        registerResponse.EnsureSuccessStatusCode();

        var response = await Client.PostAsJsonAsync("/api/auth/login", new
        {
            email = cmd.Email,
            password = cmd.Password
        }, JsonOptions);

        response.EnsureSuccessStatusCode();
        var auth = await DeserializeAsync<AuthResponse>(response);
        auth.Should().NotBeNull();
        auth.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsUnauthorized()
    {
        var cmd = Fixture.Create<RegisterCommand>();
        var registerResponse = await Client.PostAsJsonAsync("/api/auth/register", cmd, JsonOptions);
        registerResponse.EnsureSuccessStatusCode();

        var response = await Client.PostAsJsonAsync("/api/auth/login", new
        {
            email = cmd.Email,
            password = Fixture.Faker.Internet.Password()
        }, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_WithNonExistentEmail_ReturnsUnauthorized()
    {
        var response = await Client.PostAsJsonAsync("/api/auth/login", new
        {
            email = Fixture.Faker.Internet.Email(),
            password = Fixture.Faker.Internet.Password()
        }, JsonOptions);

        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task RegisterAndLogin_FullRoundTrip()
    {
        var cmd = Fixture.Create<RegisterCommand>();

        // Register
        var registerResponse = await Client.PostAsJsonAsync("/api/auth/register", cmd, JsonOptions);
        registerResponse.EnsureSuccessStatusCode();
        var registerAuth = await DeserializeAsync<AuthResponse>(registerResponse);

        // Login with same credentials
        var loginResponse = await Client.PostAsJsonAsync("/api/auth/login", new
        {
            email = cmd.Email,
            password = cmd.Password
        }, JsonOptions);

        loginResponse.EnsureSuccessStatusCode();
        var loginAuth = await DeserializeAsync<AuthResponse>(loginResponse);

        // Same user returned
        loginAuth!.User.Id.Should().Be(registerAuth!.User.Id);
        loginAuth.User.Username.Should().Be(cmd.Username);
    }
}
