using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Enums;
using Cruxa.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace Cruxa.Tests.Integration;

public abstract class IntegrationTestBase(CruxaApiFactory factory) : IClassFixture<CruxaApiFactory>
{
    protected readonly HttpClient Client = factory.CreateClient();
    protected readonly TestFixture Fixture = new();
    protected Guid CurrentUserId { get; private set; }

    protected static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new JsonStringEnumConverter() }
    };

    /// <summary>
    /// Switch to a new random user context (clears current token, registers a new user, sets the Bearer token).
    /// Returns the AuthResponse so callers can access User.Id etc.
    /// </summary>
    protected async Task<AuthResponse> ActAsNewUserAsync()
    {
        ClearToken();
        var auth = await RegisterAsync(Fixture.Create<RegisterCommand>());
        CurrentUserId = auth.User.Id;
        SetToken(auth.Token);
        return auth;
    }
    
    /// <summary>
    /// Register using a pre-built RegisterCommand.
    /// </summary>
    private async Task<AuthResponse> RegisterAsync(RegisterCommand command)
    {
        var response = await Client.PostAsJsonAsync("/api/auth/register", command, JsonOptions);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<AuthResponse>(JsonOptions))!;
    }
    
    /// <summary>
    /// Set the Bearer token for subsequent requests.
    /// </summary>
    protected void SetToken(string token)
    {
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    /// <summary>
    /// Clear the Authorization header.
    /// </summary>
    protected void ClearToken()
    {
        Client.DefaultRequestHeaders.Authorization = null;
    }

    /// <summary>
    /// Deserialize response content.
    /// </summary>
    protected async Task<T?> DeserializeAsync<T>(HttpResponseMessage response)
    {
        return await response.Content.ReadFromJsonAsync<T>(JsonOptions);
    }

    /// <summary>
    /// Register a new user via Fixture, promote to Admin, re-login.
    /// Returns the RegisterCommand so callers can access Email/Password for LoginAsync.
    /// </summary>
    protected async Task<RegisterCommand> SetupAdminAsync()
    {
        var cmd = Fixture.Create<RegisterCommand>();
        var auth = await RegisterAsync(cmd);
        CurrentUserId = auth.User.Id;
        SetToken(auth.Token);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CruxaDbContext>();
        var user = db.Users.AsEnumerable().First(u => u.Email.Value == cmd.Email.ToLowerInvariant());
        user.ChangeRole(Role.Admin);
        await db.SaveChangesAsync();

        auth = await LoginAsync(cmd.Email, cmd.Password);
        CurrentUserId = auth.User.Id;
        SetToken(auth.Token);
        return cmd;
    }
    
    /// <summary>
    /// Login and return the auth response.
    /// </summary>
    private async Task<AuthResponse> LoginAsync(string email, string password)
    {
        var query = new LoginCommand(email, password);
        var response = await Client.PostAsJsonAsync("/api/auth/login", query, JsonOptions);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<AuthResponse>(JsonOptions))!;
    }

    /// <summary>
    /// Register a new user via Fixture, promote to GymAdmin, re-login.
    /// Returns the RegisterCommand so callers can access Email/Password for LoginAsync.
    /// </summary>
    protected async Task<RegisterCommand> SetupGymAdminAsync()
    {
        var cmd = Fixture.Create<RegisterCommand>();
        var auth = await RegisterAsync(cmd);
        CurrentUserId = auth.User.Id;
        SetToken(auth.Token);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CruxaDbContext>();
        var user = db.Users.AsEnumerable().First(u => u.Email.Value == cmd.Email.ToLowerInvariant());
        user.ChangeRole(Role.GymAdmin);
        await db.SaveChangesAsync();

        auth = await LoginAsync(cmd.Email, cmd.Password);
        CurrentUserId = auth.User.Id;
        SetToken(auth.Token);
        return cmd;
    }

    /// <summary>
    /// Register a new user via Fixture, promote to Routesetter, re-login.
    /// </summary>
    protected async Task<RegisterCommand> SetupRoutesetterAsync()
    {
        var cmd = Fixture.Create<RegisterCommand>();
        var auth = await RegisterAsync(cmd);
        CurrentUserId = auth.User.Id;
        SetToken(auth.Token);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CruxaDbContext>();
        var user = db.Users.AsEnumerable().First(u => u.Email.Value == cmd.Email.ToLowerInvariant());
        user.ChangeRole(Role.Routesetter);
        await db.SaveChangesAsync();

        auth = await LoginAsync(cmd.Email, cmd.Password);
        CurrentUserId = auth.User.Id;
        SetToken(auth.Token);
        return cmd;
    }

    /// <summary>
    /// Create a gym using the current auth context (must be Admin/GymAdmin).
    /// Returns the GymDto.
    /// </summary>
    protected async Task<GymDto> CreateGymAsync()
    {
        var command = Fixture.Create<CreateGymCommand>();
        var response = await Client.PostAsJsonAsync("/api/gyms", command, JsonOptions);
        response.EnsureSuccessStatusCode();
        return (await DeserializeAsync<GymDto>(response))!;
    }

    /// <summary>
    /// Create a route in the specified gym using the current auth context.
    /// Returns the RouteDto.
    /// </summary>
    protected async Task<RouteDto> CreateRouteAsync(Guid gymId)
    {
        var cmd = Fixture.Create<CreateRouteCommand>() with { GymId = gymId, Tags = null };
        var response = await Client.PostAsJsonAsync("/api/routes", cmd, JsonOptions);
        response.EnsureSuccessStatusCode();
        return (await DeserializeAsync<RouteDto>(response))!;
    }

    /// <summary>
    /// Create a CreatePostRequest with the specified GymId using Fixture defaults.
    /// </summary>
    protected CreatePostRequest MakePostRequest(Guid gymId)
    {
        var req = Fixture.Create<CreatePostRequest>();
        req.GymId = gymId;
        req.Visibility = PostVisibility.Public;
        return req;
    }

    /// <summary>
    /// Create a published post as the current user (must be Admin/GymAdmin).
    /// Returns the PostDto.
    /// </summary>
    protected async Task<PostDto> CreatePublishedPostAsync()
    {
        await SetupAdminAsync();
        var gym = await CreateGymAsync();
        var postResponse = await Client.PostAsJsonAsync("/api/posts", MakePostRequest(gym.Id), JsonOptions);
        postResponse.EnsureSuccessStatusCode();
        var post = (await DeserializeAsync<PostDto>(postResponse))!;
        await Client.PutAsync($"/api/posts/{post.Id}/publish", null);
        return post;
    }
}
