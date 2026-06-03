using Cruxa.Application.Extensions;
using Cruxa.Infrastructure.Extensions;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;

// ──────────────────────────────────────────────
// Serilog bootstrap (catches startup errors)
// ──────────────────────────────────────────────
if (Log.Logger is not Serilog.Extensions.Hosting.ReloadableLogger)
{
    Log.Logger = new LoggerConfiguration()
        .WriteTo.Console()
        .CreateBootstrapLogger();
}

try
{
    var builder = WebApplication.CreateBuilder(args);

    // ──────────────────────────────────────────
    // Serilog (full configuration from appsettings)
    // Skip in test environment to avoid logger freeze
    // ──────────────────────────────────────────
    if (!builder.Environment.IsEnvironment("Testing"))
    {
        builder.Host.UseSerilog((context, logger) =>
            logger.ReadFrom.Configuration(context.Configuration));
    }

    // ──────────────────────────────────────────
    // Local-only settings (not in repo)
    // ──────────────────────────────────────────
    builder.Configuration.AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true);

    // ──────────────────────────────────────────
    // Environment variables ⇒ highest priority
    // (re-add after local.json so they always win)
    // ──────────────────────────────────────────
    builder.Configuration.AddEnvironmentVariables();

    // ──────────────────────────────────────────
    // Controllers
    // ──────────────────────────────────────────
    builder.Services.AddControllers()
    .AddJsonOptions(opts => opts.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));

    // ──────────────────────────────────────────
    // OpenAPI / Scalar
    // ──────────────────────────────────────────
    builder.Services.AddOpenApi();

    // ──────────────────────────────────────────
    // Health Checks
    // ──────────────────────────────────────────
    builder.Services.AddHealthChecks()
        .AddDbContextCheck<CruxaDbContext>();

    // ──────────────────────────────────────────
    // Infrastructure & Application layers
    // ──────────────────────────────────────────
    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.AddApplication(builder.Configuration);

    // ──────────────────────────────────────────
    // JWT Authentication
    // ──────────────────────────────────────────
    var jwtSecret = builder.Configuration["Jwt:Secret"]
        ?? throw new InvalidOperationException("JWT Secret not configured");
    var jwtIssuer = builder.Configuration["Jwt:Issuer"]
        ?? throw new InvalidOperationException("JWT Issuer not configured");
    var jwtAudience = builder.Configuration["Jwt:Audience"]
        ?? throw new InvalidOperationException("JWT Audience not configured");

    builder.Services.AddAuthentication("Bearer")
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes(jwtSecret)),
                ClockSkew = TimeSpan.Zero
            };
        });

    // Authorization with policies based on roles
    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
        options.AddPolicy("RequireGymAdmin", policy => policy.RequireRole("GymAdmin", "Admin"));
        options.AddPolicy("RequireRoutesetter", policy => policy.RequireRole("Routesetter", "GymAdmin", "Admin"));
    });

    var app = builder.Build();

    // ──────────────────────────────────────────
    // Auto-apply EF Core migrations on startup
    // ──────────────────────────────────────────
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<CruxaDbContext>();
        await db.Database.MigrateAsync();
    }

    // ──────────────────────────────────────────
    // Middleware pipeline
    // ──────────────────────────────────────────
    app.UseMiddleware<Cruxa.Api.Common.Middleware.ExceptionHandlingMiddleware>();

    // Swagger / Scalar (only in Development)
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();
    }

    // Health Checks endpoint
    app.MapHealthChecks("/_health");

    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    Log.Information("Cruxa API started successfully");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Cruxa API terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
