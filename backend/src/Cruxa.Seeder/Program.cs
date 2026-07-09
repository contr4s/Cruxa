using Cruxa.Application.Features.Statistics.Services;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Extensions;
using Cruxa.Infrastructure.Extensions;
using Cruxa.Infrastructure.Persistence;
using Cruxa.Seeder.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((context, config) =>
    {
        config.SetBasePath(AppContext.BaseDirectory);
        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        config.AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true);
        config.AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        // Register full infrastructure + application (repos, MediatR, KruscoreService, DbContext, etc.)
        services.AddInfrastructure(context.Configuration);
        services.AddApplication(context.Configuration);
        services.AddScoped<Cruxa.Application.Features.Posts.Handlers.PublishPostHandler>();
        services.AddScoped<SeedService>();
    })
    .Build();

var argsList = args.ToList();
var command = argsList.Count > 0 ? argsList[0].ToLowerInvariant() : "help";

switch (command)
{
    case "seed":
    {
        using var scope = host.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CruxaDbContext>();
        await db.Database.MigrateAsync();
        var seeder = scope.ServiceProvider.GetRequiredService<SeedService>();
        await seeder.SeedAsync();
        return 0;
    }

    case "clear":
    {
        using var scope = host.Services.CreateScope();
        var seeder = scope.ServiceProvider.GetRequiredService<SeedService>();
        await seeder.ClearAsync();
        return 0;
    }

    default:
        Console.WriteLine("""
            Cruxa.Seeder — CLI tool for seeding test data

            Usage:
              dotnet run -- seed    Generate all seed data
              dotnet run -- clear   Remove all seed data
            """);
        return 0;
}
