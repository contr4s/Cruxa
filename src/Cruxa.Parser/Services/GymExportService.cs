using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Cruxa.Domain.Common;
using Cruxa.Parser.Models;
using Microsoft.Extensions.Logging;

namespace Cruxa.Parser.Services;

/// <summary>
/// Handles export of parsed gyms to JSON files on disk.
/// </summary>
public class GymExportService
{
    private readonly ILogger<GymExportService> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        Converters = { new TimeOnlyJsonConverter() }
    };

    public GymExportService(ILogger<GymExportService> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Exports a list of parsed gyms to a JSON file.
    /// Creates the output directory if it doesn't exist.
    /// </summary>
    /// <param name="gyms">List of gyms to export.</param>
    /// <param name="filePath">Full path to the output JSON file.</param>
    /// <param name="ct">Cancellation token.</param>
    public async Task ExportAsync(List<ParsedGym> gyms, string filePath, CancellationToken ct = default)
    {
        var dir = Path.GetDirectoryName(filePath);
        if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir);
        }

        var json = JsonSerializer.Serialize(gyms, JsonOptions);
        await File.WriteAllTextAsync(filePath, json, ct);

        _logger.LogInformation("Exported {Count} gyms to {FilePath}", gyms.Count, filePath);
    }

    /// <summary>
    /// Imports a list of parsed gyms from a JSON file.
    /// </summary>
    /// <param name="filePath">Full path to the JSON file.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>List of parsed gyms.</returns>
    public async Task<List<ParsedGym>> ImportAsync(string filePath, CancellationToken ct = default)
    {
        if (!File.Exists(filePath))
        {
            _logger.LogError("File not found: {FilePath}", filePath);
            return [];
        }

        var json = await File.ReadAllTextAsync(filePath, ct);
        var gyms = JsonSerializer.Deserialize<List<ParsedGym>>(json, JsonOptions);

        _logger.LogInformation("Loaded {Count} gyms from {FilePath}", gyms?.Count ?? 0, filePath);
        return gyms ?? [];
    }
}
