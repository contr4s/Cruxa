using Cruxa.Parser.Commands;
using Cruxa.Parser.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((context, config) =>
    {
        config.SetBasePath(AppContext.BaseDirectory);
        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        config.AddJsonFile("appsettings.local.json", optional: true, reloadOnChange: true);
        config.AddEnvironmentVariables();
        config.AddCommandLine(args);
    })
    .ConfigureServices((context, services) =>
    {
        // HTTP client for ClimbingPro scraping
        services.AddHttpClient<IClimbingProClient, ClimbingProClient>(client =>
        {
            client.BaseAddress = new Uri("https://maps.climbingpro.ru");
            client.DefaultRequestHeaders.UserAgent.ParseAdd("Cruxa.Parser/1.0");
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        // HTTP client for SeedCommand (calls Cruxa API)
        services.AddHttpClient<SeedCommand>(client =>
        {
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });

        // Parser services
        services.AddSingleton<GymExportService>();
        services.AddTransient<ScrapeCommand>();
        services.AddTransient<SeedCommand>();
    })
    .ConfigureLogging((context, logging) =>
    {
        logging.ClearProviders();
        logging.AddConsole();
        logging.SetMinimumLevel(LogLevel.Information);
    })
    .Build();

// ──────────────────────────────────────────
// Simple CLI command routing
// ──────────────────────────────────────────
var argsList = args.ToList();
var command = argsList.Count > 0 ? argsList[0].ToLowerInvariant() : "help";

switch (command)
{
    case "scrape":
    {
        var scrape = host.Services.GetRequiredService<ScrapeCommand>();
        var config = host.Services.GetRequiredService<IConfiguration>();
        var client = host.Services.GetRequiredService<IClimbingProClient>();

        Dictionary<string, string> cities;
        if (argsList.Contains("--all"))
        {
            cities = await client.GetAllCitiesAsync();
            Console.WriteLine($"Found {cities.Count} cities, starting scrape...");
        }
        else
        {
            cities = config.GetSection("Scrape:Cities").Get<Dictionary<string, string>>()
                     ?? new Dictionary<string, string>
                     {
                         ["Москва"] = "moskva",
                         ["Санкт-Петербург"] = "spb"
                     };
        }

        var outputDir = config["Scrape:OutputDir"] ?? "data";
        if (!Path.IsPathRooted(outputDir))
        {
            outputDir = ResolveRepoRelative(outputDir);
        }
        Directory.CreateDirectory(outputDir);

        var exitCode = await scrape.ExecuteAsync(cities, outputDir);
        Console.WriteLine($"Exit code: {exitCode}");
        return exitCode > 0 ? 0 : 1;
    }

    case "seed":
    {
        var seed = host.Services.GetRequiredService<SeedCommand>();
        var config = host.Services.GetRequiredService<IConfiguration>();

        // Get input file from --input argument or default
        var inputIndex = argsList.IndexOf("--input");
        var inputFile = inputIndex >= 0 && inputIndex + 1 < argsList.Count
            ? argsList[inputIndex + 1]
            : null;

        var clear = argsList.Contains("--clear");

        var exitCode = await seed.ExecuteAsync(inputFile, clear);
        return exitCode ? 0 : 1;
    }

    case "help":
    default:
        PrintHelp();
        return 0;
}

/// <summary>
/// Resolve a relative path against the solution root (where Cruxa.slnx lives).
/// Walks up from the output directory until it finds the .slnx marker.
/// </summary>
static string ResolveRepoRelative(string relativePath)
{
    var dir = AppContext.BaseDirectory;
    for (var i = 0; i < 10; i++)
    {
        if (Directory.GetFiles(dir, "Cruxa.slnx").Length > 0)
            return Path.Combine(dir, relativePath);
        var parent = Path.GetDirectoryName(dir);
        if (parent is null) break;
        dir = parent;
    }
    // Fallback: just combine with base dir
    return Path.Combine(AppContext.BaseDirectory, relativePath);
}

static void PrintHelp()
{
    Console.WriteLine("""
        Cruxa.Parser — CLI tool for scraping and seeding gym data

        Usage:
          dotnet run -- scrape              Fetch gyms from climbingpro.ru and save to JSON
          dotnet run -- seed --input <file>  Load JSON file and send to Cruxa API
          dotnet run -- help                 Show this help message

        Configuration:
          appsettings.json     — main configuration (cities, etc.)
          appsettings.local.json — local overrides (admin credentials, etc.)

        Examples:
          dotnet run -- scrape
          dotnet run -- seed --input data/gyms-moskva.json
        """);
}
