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
    /// <param name="city">City display name (e.g. "Москва").</param>
    /// <param name="citySlug">City slug in URL (e.g. "moskva").</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>List of parsed gyms.</returns>
    Task<List<ParsedGym>> ScrapeCityAsync(string city, string citySlug, CancellationToken ct = default);
}
