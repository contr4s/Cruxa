using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Extensions;
using Cruxa.Api.Common;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Domain.ValueObjects;
using Cruxa.Infrastructure.Extensions;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;
using System.Text.Json;
using System.Text.Json.Serialization;

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
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        opts.JsonSerializerOptions.Converters.Add(new TimeOnlyJsonConverter());
    });

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
    // Current User Service
    // ──────────────────────────────────────────
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

    // ──────────────────────────────────────────
    // CORS (allow frontend dev servers)
    // ──────────────────────────────────────────
    var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? ["http://localhost:5173"];
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
            policy.WithOrigins(corsOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials());
    });

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

        // Seed admin password credential from local config
        var adminPasswordHash = app.Configuration["AdminPasswordHash"];
        if (!string.IsNullOrEmpty(adminPasswordHash))
        {
            var adminId = Guid.Parse("00000000-0000-0000-0000-000000000001");
            if (!await db.Users.AnyAsync(u => u.Id == adminId))
            {
                var adminEmail = Email.Create("admin@cruxa.app").Value;
                var admin = User.Create(adminEmail, "admin", "Admin", "Cruxa", "M", 180, "Москва").Value!;
                admin.Id = adminId;
                admin.ChangeRole(Role.Admin);
                db.Users.Add(admin);
            }

            if (!await db.PasswordCredentials.AnyAsync(pc => pc.UserId == adminId))
            {
                db.PasswordCredentials.Add(new PasswordCredential(
                    adminId, adminPasswordHash));
                await db.SaveChangesAsync();
            }
        }
    }

    // ──────────────────────────────────────────
    // Middleware pipeline
    // ──────────────────────────────────────────
    app.UseMiddleware<Cruxa.Api.Common.Middleware.CorrelationIdMiddleware>();
    app.UseMiddleware<Cruxa.Api.Common.Middleware.ResponseLoggingMiddleware>();
    app.UseMiddleware<Cruxa.Api.Common.Middleware.ExceptionHandlingMiddleware>();
    app.UseSerilogRequestLogging();

    // Swagger / Scalar (only in Development)
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();
    }

    // Health Checks endpoint
    app.MapHealthChecks("/_health");

    app.UseCors();

    // HTTPS redirect only in non-Docker / non-Production scenarios.
    // In Docker (Production), TLS is terminated at the reverse proxy level.
    if (!app.Environment.IsDevelopment() && !app.Environment.IsEnvironment("Testing"))
    {
        app.UseHttpsRedirection();
    }

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
