using Cruxa.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Configuration;
using Testcontainers.PostgreSql;

namespace Cruxa.Tests.Integration;

public class CruxaApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:15-alpine")
        .WithDatabase("cruxa_test")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .WithCleanUp(true)
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            // Remove the real DbContext registration
            services.RemoveAll<DbContextOptions<CruxaDbContext>>();

            // Register DbContext with Testcontainers connection string
            var dataSourceBuilder = new Npgsql.NpgsqlDataSourceBuilder(_postgres.GetConnectionString());
            dataSourceBuilder.EnableDynamicJson();
            var dataSource = dataSourceBuilder.Build();

            services.AddDbContext<CruxaDbContext>(options =>
                options.UseNpgsql(dataSource,
                    b => b.MigrationsAssembly(typeof(CruxaDbContext).Assembly.FullName)));
        });

        // Override environment settings
        builder.UseEnvironment("Testing");
        builder.UseSetting("Jwt:Secret", "test-secret-key-32-chars-long-at-least!!");
    }

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();

        // Run migrations on the test database
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CruxaDbContext>();
        await db.Database.MigrateAsync();
    }

    public new async Task DisposeAsync()
    {
        await _postgres.DisposeAsync();
    }
}
