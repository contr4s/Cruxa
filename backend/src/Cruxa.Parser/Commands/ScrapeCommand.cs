using Cruxa.Parser.Services;
using Microsoft.Extensions.Logging;

namespace Cruxa.Parser.Commands;

/// <summary>
/// Scrape command: fetches gym data from climbingpro.ru for configured cities
/// and exports to JSON files.
/// </summary>
public class ScrapeCommand
{
    private readonly IClimbingProClient _climbingProClient;
    private readonly GymExportService _exportService;
    private readonly ILogger<ScrapeCommand> _logger;

    public ScrapeCommand(
        IClimbingProClient climbingProClient,
        GymExportService exportService,
        ILogger<ScrapeCommand> logger)
    {
        _climbingProClient = climbingProClient;
        _exportService = exportService;
        _logger = logger;
    }

    public async Task<int> ExecuteAsync(Dictionary<string, string> cities, string outputDir, CancellationToken ct = default)
    {
        var totalGyms = 0;

        foreach (var (city, slug) in cities)
        {
            _logger.LogInformation("=== Scraping gyms for city: {City} (slug: {Slug}) ===", city, slug);

            var gyms = await _climbingProClient.ScrapeCityAsync(city, slug, ct);

            if (gyms.Count == 0)
            {
                _logger.LogWarning("No gyms found for {City}", city);
                continue;
            }

            var safeFileName = slug;
            var filePath = Path.Combine(outputDir, $"gyms-{safeFileName}.json");
            await _exportService.ExportAsync(gyms, filePath, ct);

            _logger.LogInformation("Saved {Count} gyms for {City} → {FilePath}", gyms.Count, city, filePath);
            totalGyms += gyms.Count;
        }

        _logger.LogInformation("=== Scrape complete. Total gyms collected: {Total} ===", totalGyms);
        return totalGyms;
    }
}
