using Cruxa.Parser.Models;

namespace Cruxa.Parser.Services;

/// <summary>
/// Client for scraping climbing gym data from maps.climbingpro.ru.
/// </summary>
public interface IClimbingProClient
{
    /// <summary>
    /// Scrapes all gyms for a given city from climbingpro.ru.
    /// </summary>
    Task<List<ParsedGym>> ScrapeCityAsync(string city, string citySlug, CancellationToken ct = default);

    /// <summary>
    /// Returns all available city names and slugs from climbingpro.ru.
    /// </summary>
    Task<Dictionary<string, string>> GetAllCitiesAsync(CancellationToken ct = default);
}
