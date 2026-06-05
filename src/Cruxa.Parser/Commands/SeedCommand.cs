using System.Net.Http.Headers;
using System.Net.Http.Json;
using Cruxa.Parser.Models;
using Cruxa.Parser.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Cruxa.Parser.Commands;

/// <summary>
/// Seed command: reads parsed gyms from a JSON file and sends them to the
/// Cruxa API import endpoint (POST /api/gyms/import).
/// </summary>
public class SeedCommand
{
    private readonly HttpClient _httpClient;
    private readonly GymExportService _exportService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<SeedCommand> _logger;

    public SeedCommand(
        HttpClient httpClient,
        GymExportService exportService,
        IConfiguration configuration,
        ILogger<SeedCommand> logger)
    {
        _httpClient = httpClient;
        _exportService = exportService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> ExecuteAsync(string? inputFile = null, bool clear = false, CancellationToken ct = default)
    {
        var apiBaseUrl = _configuration["Seed:ApiBaseUrl"] ?? "http://localhost:5000";
        var adminEmail = _configuration["Seed:AdminEmail"];
        var adminPassword = _configuration["Seed:AdminPassword"];
        var chunkSize = int.Parse(_configuration["Seed:ChunkSize"] ?? "50");

        if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
        {
            _logger.LogError("Seed:AdminEmail and Seed:AdminPassword must be configured in appsettings.local.json");
            return false;
        }

        // Determine input files — either a single file or all gyms-*.json in output dir
        List<string> inputFiles;
        if (!string.IsNullOrWhiteSpace(inputFile))
        {
            inputFiles = [inputFile];
        }
        else
        {
            // Resolve output dir relative to the repo root (where Cruxa.slnx lives)
            var outputDir = _configuration["Scrape:OutputDir"] ?? "data";
            if (!Path.IsPathRooted(outputDir))
            {
                var dir = AppContext.BaseDirectory;
                for (var i = 0; i < 10; i++)
                {
                    if (Directory.GetFiles(dir, "Cruxa.slnx").Length > 0)
                    {
                        outputDir = Path.Combine(dir, outputDir);
                        break;
                    }
                    var parent = Path.GetDirectoryName(dir);
                    if (parent is null) break;
                    dir = parent;
                }
            }

            _logger.LogInformation("No --input specified; looking for gyms-*.json files in {OutputDir}", outputDir);

            inputFiles = Directory.GetFiles(outputDir, "gyms-*.json").ToList();
            if (inputFiles.Count == 0)
            {
                _logger.LogError("No gyms-*.json files found in {OutputDir}. Run 'scrape' first or specify --input.", outputDir);
                return false;
            }

            _logger.LogInformation("Found {Count} files to process: {Files}", inputFiles.Count, string.Join(", ", inputFiles));
        }

        // Authenticate as admin once
        _logger.LogInformation("Authenticating as admin...");
        var token = await AuthenticateAsync(apiBaseUrl, adminEmail, adminPassword, ct);
        if (string.IsNullOrWhiteSpace(token))
        {
            _logger.LogError("Authentication failed. Check Seed:AdminEmail and Seed:AdminPassword.");
            return false;
        }

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Clear existing gyms if requested
        if (clear)
        {
            _logger.LogInformation("Clearing all existing gyms...");
            var clearUrl = $"{apiBaseUrl.TrimEnd('/')}/api/gyms/clear";
            var clearResponse = await _httpClient.DeleteAsync(clearUrl, ct);
            if (clearResponse.IsSuccessStatusCode)
            {
                _logger.LogInformation("All existing gyms cleared.");
            }
            else
            {
                _logger.LogWarning("Failed to clear gyms: {Status}", clearResponse.StatusCode);
            }
        }

        // Process all files
        var totalImported = 0;
        var totalSkipped = 0;
        var totalErrors = 0;

        foreach (var file in inputFiles)
        {
            ct.ThrowIfCancellationRequested();

            var gyms = await _exportService.ImportAsync(file, ct);
            if (gyms.Count == 0)
            {
                _logger.LogWarning("No gyms found in {InputFile}, skipping", file);
                continue;
            }

            _logger.LogInformation("Loaded {Count} gyms from {InputFile}", gyms.Count, file);

            for (var i = 0; i < gyms.Count; i += chunkSize)
            {
                ct.ThrowIfCancellationRequested();

                var chunk = gyms.Skip(i).Take(chunkSize).ToList();
                _logger.LogInformation("Sending chunk {ChunkNumber}/{TotalChunks} ({Count} gyms) from {File}...",
                    i / chunkSize + 1, (int)Math.Ceiling((double)gyms.Count / chunkSize), chunk.Count, Path.GetFileName(file));

                try
                {
                    var result = await SendChunkAsync(apiBaseUrl, chunk, ct);
                    totalImported += result.Imported;
                    totalSkipped += result.Skipped;
                    if (result.Errors is not null)
                        totalErrors += result.Errors.Count;

                    _logger.LogInformation("Chunk result: +{Imported} imported, {Skipped} skipped, {Errors} errors",
                        result.Imported, result.Skipped, result.Errors?.Count ?? 0);
                }
                catch (HttpRequestException ex)
                {
                    _logger.LogError(ex, "Failed to send chunk {ChunkNumber} from {File}", i / chunkSize + 1, Path.GetFileName(file));
                    totalErrors += chunk.Count;
                }
            }
        }

        _logger.LogInformation("=== Seed complete. Total: {Total} imported, {Skipped} skipped, {Errors} errors ===",
            totalImported, totalSkipped, totalErrors);

        return totalErrors == 0;
    }

    private async Task<string?> AuthenticateAsync(string apiBaseUrl, string email, string password, CancellationToken ct)
    {
        var loginUrl = $"{apiBaseUrl.TrimEnd('/')}/api/auth/login";
        var loginPayload = new { email, password };

        try
        {
            var response = await _httpClient.PostAsJsonAsync(loginUrl, loginPayload, ct);
            response.EnsureSuccessStatusCode();

            var authResult = await response.Content.ReadFromJsonAsync<AuthResponse>(cancellationToken: ct);
            var token = authResult?.Token;

            if (string.IsNullOrWhiteSpace(token))
            {
                _logger.LogError("Authentication returned empty token");
                return null;
            }

            _logger.LogInformation("Authenticated successfully as {Email}", email);
            return token;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Authentication failed for {Email}", email);
            return null;
        }
    }

    private async Task<BulkImportResult> SendChunkAsync(string apiBaseUrl, List<ParsedGym> chunk, CancellationToken ct)
    {
        var importUrl = $"{apiBaseUrl.TrimEnd('/')}/api/gyms/import";

        // Map ParsedGym → ImportGymDto
        var importGyms = chunk.Select(g => new ImportGymDto
        {
            Name = g.Name,
            City = g.City,
            Address = g.Address,
            Latitude = g.Latitude,
            Longitude = g.Longitude,
            Description = g.Description,
            ContactInfo = g.ContactInfo,
            ContactEmail = g.ContactEmail,
            SocialLinks = g.SocialLinks?.Count > 0 ? g.SocialLinks : null,
            Website = g.Website,
            Prices = g.Prices,
            WorkingHours = g.WorkingHours,
            PhotoUrls = g.PhotoUrls,
            WallArea = g.WallArea,
            MaxHeight = g.MaxHeight,
            YearFounded = g.YearFounded,
            MetroStations = g.MetroStations?.Count > 0 ? g.MetroStations : null,
            Tags = g.Tags?.Count > 0 ? g.Tags : null
        }).ToList();

        var payload = new { gyms = importGyms };
        var response = await _httpClient.PostAsJsonAsync(importUrl, payload, ct);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<BulkImportResult>(cancellationToken: ct);
        return result ?? new BulkImportResult { Imported = 0, Skipped = 0 };
    }

    // ── DTOs matching the API contracts ──

    private class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
    }

    private class ImportGymDto
    {
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Description { get; set; }
        public string? ContactInfo { get; set; }
        public string? ContactEmail { get; set; }
        public List<string>? SocialLinks { get; set; }
        public string? Website { get; set; }
        public List<Cruxa.Domain.ValueObjects.PriceItem>? Prices { get; set; }
        public List<Cruxa.Domain.ValueObjects.WorkingHoursEntry>? WorkingHours { get; set; }
        public List<string> PhotoUrls { get; set; } = [];
        public double? WallArea { get; set; }
        public double? MaxHeight { get; set; }
        public int? YearFounded { get; set; }
        public List<string>? MetroStations { get; set; }
        public List<string>? Tags { get; set; }
    }

    private class BulkImportResult
    {
        public int Imported { get; set; }
        public int Skipped { get; set; }
        public List<string>? Errors { get; set; }
    }
}
