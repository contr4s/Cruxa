using System.Text.Json;
using System.Text.RegularExpressions;
using Cruxa.Parser.Models;
using Cruxa.Domain.ValueObjects;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;

namespace Cruxa.Parser.Services;

/// <summary>
/// Scrapes climbing gym data from maps.climbingpro.ru.
/// Parses HTML pages for each city and individual gym pages.
/// </summary>
public partial class ClimbingProClient : IClimbingProClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ClimbingProClient> _logger;

    private const string BaseUrl = "https://maps.climbingpro.ru";
    private static readonly TimeSpan RequestDelay = TimeSpan.FromSeconds(1);

    public ClimbingProClient(
        HttpClient httpClient,
        ILogger<ClimbingProClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<List<ParsedGym>> ScrapeCityAsync(string city, string citySlug, CancellationToken ct = default)
    {
        var gyms = new List<ParsedGym>();

        // Load city page to get list of gym URLs
        var cityUrl = $"{BaseUrl}/city/{citySlug}/";
        _logger.LogInformation("Loading city page: {Url}", cityUrl);

        var html = await LoadPageAsync(cityUrl, ct);
        if (string.IsNullOrEmpty(html))
        {
            _logger.LogWarning("Could not load city page for {City}", city);
            return gyms;
        }

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        // Extract gym links from the city page
        var gymLinks = ExtractGymLinks(doc);
        _logger.LogInformation("Found {Count} gym links for {City}", gymLinks.Count, city);

        foreach (var (gymName, gymPath) in gymLinks)
        {
            if (ct.IsCancellationRequested) break;

            try
            {
                var gym = await ScrapeGymAsync(gymName, gymPath, city, ct);
                if (gym is not null)
                {
                    gyms.Add(gym);
                    _logger.LogInformation("Parsed gym: {Name} ({City})", gym.Name, city);
                }

                // Delay between requests to be respectful
                await Task.Delay(RequestDelay, ct);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse gym: {Name}", gymName);
            }
        }

        _logger.LogInformation("Completed scraping {City}: {Count} gyms", city, gyms.Count);
        return gyms;
    }

    private static readonly HashSet<string> ExcludedPaths = new(StringComparer.OrdinalIgnoreCase)
    {
        "/addsite/", "/reclame/", "/agreement/", "/contact/", "/rules/",
        "/insurance/", "/page/insurance/"
    };

    /// <summary>
    /// Extracts gym links (name, relative path) from the city listing page.
    /// Looks for anchor tags pointing to gym detail pages.
    /// </summary>
    private static List<(string name, string path)> ExtractGymLinks(HtmlDocument doc)
    {
        var links = new List<(string name, string path)>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        // Gym links are typically <a href="/gym-name/"> inside cards
        var anchors = doc.DocumentNode.SelectNodes("//a[contains(@href, '/') and not(contains(@href, '://'))]");
        if (anchors is null) return links;

        foreach (var a in anchors)
        {
            var href = a.GetAttributeValue("href", "");
            // Gym paths look like /gym-name/ (not city/, /page/, /metro/, /district/)
            if (Regex.IsMatch(href, @"^/[a-z0-9-]+/$") &&
                !href.StartsWith("/city/") &&
                !href.StartsWith("/page/") &&
                !href.StartsWith("/metro/") &&
                !href.StartsWith("/district/") &&
                !href.StartsWith("/podborki/") &&
                !href.Contains("#") &&
                !ExcludedPaths.Contains(href))
            {
                var name = a.InnerText.Trim();
                if (string.IsNullOrWhiteSpace(name)) continue;

                // Deduplicate by path
                if (!seen.Add(href)) continue;

                links.Add((name, href));
            }
        }

        return links;
    }

    public async Task<Dictionary<string, string>> GetAllCitiesAsync(CancellationToken ct = default)
    {
        var html = await LoadPageAsync($"{BaseUrl}/city/skalodromy-rossii/", ct);
        var cities = new Dictionary<string, string>();
        if (string.IsNullOrEmpty(html)) return cities;

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var links = doc.DocumentNode.SelectNodes("//a[contains(@href,'/city/')]");
        if (links is null) return cities;

        foreach (var a in links)
        {
            var href = a.GetAttributeValue("href", "");
            var name = a.InnerText.Trim();
            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(href)) continue;

            // /city/moskva/ → moskva
            var match = Regex.Match(href, @"/city/([^/]+)/");
            if (!match.Success) continue;
            var slug = match.Groups[1].Value;

            if (slug == "skalodromy-rossii") continue;
            cities.TryAdd(name, slug);
        }

        _logger.LogInformation("Found {Count} cities on ClimbingPro", cities.Count);
        return cities;
    }

    /// <summary>
    /// Parses an individual gym page and extracts all available data.
    /// </summary>
    private async Task<ParsedGym?> ScrapeGymAsync(string gymName, string gymPath, string city, CancellationToken ct)
    {
        var url = $"{BaseUrl}{gymPath}";
        var html = await LoadPageAsync(url, ct);
        if (string.IsNullOrEmpty(html)) return null;

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var workingHours = ExtractWorkingHours(doc);

        var parsed = new ParsedGym
        {
            Name = gymName,
            City = city,
            Address = ExtractAddress(doc) ?? "",
            Description = ExtractDescription(doc),
            ContactInfo = ExtractPhone(doc),
            ContactEmail = ExtractEmail(doc),
            SocialLinks = ExtractSocialLinks(doc),
            Website = ExtractWebsite(doc),
            WorkingHours = WorkingHoursHelper.ToEntries(workingHours),
            Prices = ExtractPrices(doc),
            PhotoUrls = ExtractPhotos(doc),
            WallArea = ExtractWallArea(doc),
            MaxHeight = ExtractMaxHeight(doc),
            YearFounded = ExtractYearFounded(doc),
            MetroStations = ExtractMetroStations(doc),
            Tags = ExtractTags(doc)
        };

        // Fetch coordinates from /data.json (GeoJSON endpoint)
        var coords = await FetchCoordinatesAsync(gymPath, ct);
        if (coords.HasValue)
        {
            parsed.Latitude = coords.Value.Latitude;
            parsed.Longitude = coords.Value.Longitude;
        }

        return parsed;
    }

    /// <summary>
    /// Fetches coordinates from the gym's data.json endpoint on climbingpro.ru.
    /// Each gym page has a corresponding /data.json with GeoJSON containing center coordinates.
    /// </summary>
    private async Task<(double Latitude, double Longitude)?> FetchCoordinatesAsync(string gymPath, CancellationToken ct)
    {
        var dataUrl = $"{BaseUrl}{gymPath}data.json";
        try
        {
            var response = await _httpClient.GetAsync(dataUrl, ct);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync(ct);
            using var doc = JsonDocument.Parse(json);

            // Format: { "center": ["lat", "lon"], "features": [...] }
            var center = doc.RootElement.GetProperty("center");
            if (center.ValueKind != JsonValueKind.Array || center.GetArrayLength() < 2)
                return null;

            var latStr = center[0].GetString();
            var lonStr = center[1].GetString();

            if (string.IsNullOrWhiteSpace(latStr) || string.IsNullOrWhiteSpace(lonStr))
                return null;

            var lat = double.Parse(latStr, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture);
            var lon = double.Parse(lonStr, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture);

            _logger.LogInformation("Got coordinates from data.json for {GymPath}: ({Lat}, {Lon})", gymPath, lat, lon);
            return (lat, lon);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to fetch coordinates from data.json for {GymPath}", gymPath);
            return null;
        }
    }

    private async Task<string?> LoadPageAsync(string url, CancellationToken ct)
    {
        try
        {
            var response = await _httpClient.GetAsync(url, ct);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync(ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load page: {Url}", url);
            return null;
        }
    }

    // ── Field extractors ──

    private static string? ExtractAddress(HtmlDocument doc)
    {
        var text = ExtractAfterLabel(doc, "Адрес:");
        return text;
    }

    private static string? ExtractPhone(HtmlDocument doc)
    {
        var tel = doc.DocumentNode.SelectSingleNode("//a[starts-with(@href,'tel:')]");
        return tel?.InnerText.Trim();
    }

    private static string? ExtractEmail(HtmlDocument doc)
    {
        var mail = doc.DocumentNode.SelectSingleNode("//a[starts-with(@href,'mailto:')]");
        return mail?.InnerText.Trim();
    }

    private static string? ExtractWebsite(HtmlDocument doc)
    {
        var link = doc.DocumentNode.SelectSingleNode("//a[contains(.,'Перейти на сайт')]");
        var href = link?.GetAttributeValue("href", "");
        return !string.IsNullOrWhiteSpace(href) && href != "#" ? href : null;
    }

    private static string? ExtractDescription(HtmlDocument doc)
    {
        // First paragraph after the title, up to "Информация о"
        var paragraphs = doc.DocumentNode.SelectNodes("//p");
        if (paragraphs is null) return null;

        foreach (var p in paragraphs)
        {
            var text = p.InnerText.Trim();
            if (text.Length > 50 && !text.Contains("Адрес:") && !text.Contains("Теги:"))
            {
                // Cut at "Информация о"
                var idx = text.IndexOf("Информация о", StringComparison.Ordinal);
                if (idx > 0) text = text[..idx].Trim();
                // Limit length
                if (text.Length > 1000) text = text[..1000] + "...";
                return text;
            }
        }
        return null;
    }

    private static List<string> ExtractSocialLinks(HtmlDocument doc)
    {
        var links = new List<string>();
        // Social links are typically after "социальных сетях:"
        var nodes = doc.DocumentNode.SelectNodes("//a[contains(@href,'http') and not(contains(@href,'climbingpro'))]");
        if (nodes is null) return links;

        foreach (var a in nodes)
        {
            var href = a.GetAttributeValue("href", "");
            if (!string.IsNullOrWhiteSpace(href) &&
                (href.Contains("vk.com") || href.Contains("t.me") || href.Contains("youtube") ||
                 href.Contains("instagram") || href.Contains("facebook") || href.Contains("twitter")))
            {
                links.Add(href);
            }
        }

        return links.Distinct().ToList();
    }

    private static Dictionary<string, string>? ExtractWorkingHours(HtmlDocument doc)
    {
        // Look for text after "Режим работы"
        var text = ExtractSectionText(doc, "Режим работы");
        if (string.IsNullOrWhiteSpace(text)) return null;

        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        // Clean up: normalize whitespace, fix "с 1500 до 2300" → "с 15:00 до 23:00"
        var lines = text.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        foreach (var line in lines)
        {
            var trimmed = line.Trim();
            if (!trimmed.Contains('—') && !trimmed.Contains('–') && !trimmed.Contains('-')) continue;

            // Normalize times: "с 1500 до 2300" → "с 15:00 до 23:00"
            trimmed = Regex.Replace(trimmed, @"(\d{1,2})(\d{2})\s*до\s*(\d{1,2})(\d{2})", 
                m => $"{m.Groups[1].Value}:{m.Groups[2].Value} до {m.Groups[3].Value}:{m.Groups[4].Value}");
            // Fix potential double prefix after time normalization
            trimmed = Regex.Replace(trimmed, @"\bс\s+с\b", "с", RegexOptions.IgnoreCase);

            // Parse: "Понедельник — с 8:00 до 23:00" → key="Понедельник", value="с 8:00 до 23:00"
            var parts = Regex.Split(trimmed, @"\s*[—–-]\s*");
            if (parts.Length < 2) continue;
            var day = parts[0].Trim();
            var hours = string.Join(" — ", parts.Skip(1)).Trim();
            if (!string.IsNullOrWhiteSpace(day) && !string.IsNullOrWhiteSpace(hours))
            {
                result[day] = hours;
            }
        }

        return result.Count > 0 ? result : null;
    }

    private static List<PriceItem> ExtractPrices(HtmlDocument doc)
    {
        var prices = new List<PriceItem>();
        var text = ExtractSectionText(doc, "Прайс-лист");
        if (string.IsNullOrWhiteSpace(text)) return prices;

        // 1. Collapse all whitespace (newlines, tabs, multiple spaces) into single spaces
        text = Regex.Replace(text, @"\s+", " ");

        // 2. Remove artifact suffixes after "руб" like "/чел", "/месс", "/6 мес", "/человека"
        //    Match: цифра(пробел)руб/суффикс (single token after /)
        //    Note: "/6 мес" works because \d* before [а-я...]+ matches "6".
        text = Regex.Replace(text, @"(\d)\s*руб\s*/+\s*\d*\s*[а-яА-ЯёЁa-zA-Z]+", "$1 руб");

        // 3. Also handle standalone "от" that appears orphaned between prices.
        //    Pattern: "руб от" → "руб "
        text = Regex.Replace(text, @"руб\s+от\s+", "руб ");

        // Format: "НазваниеЦена рубНазваниеЦена руб..."
        // Price items end with " руб" — split by it
        var segments = text.Split(" руб", StringSplitOptions.RemoveEmptyEntries);
        for (var i = 0; i < segments.Length - 1; i++) // Skip last segment (content after prices)
        {
            var segment = segments[i].Trim();
            if (string.IsNullOrWhiteSpace(segment)) continue;

            // Find trailing digits (possibly with range like "390-450")
            var digitMatch = Regex.Match(segment, @"(\d[\d\s–—-]*\d|\d+)$");
            if (digitMatch.Success)
            {
                var priceStr = digitMatch.Groups[1].Value.Trim();
                var name = segment[..^digitMatch.Length].Trim().TrimEnd(':', ' ', '\u00A0');
                // Clean up price string
                priceStr = Regex.Replace(priceStr, @"\s+", "");
                // Clean up name: if it starts with "/", strip only that leading token
                name = Regex.Replace(name, @"^/+\S+", "").Trim();
                // Strip trailing "от" (from "Разовое посещение от")
                name = Regex.Replace(name, @"\bот\s*$", "").Trim();
                // Collapse spaces one final time
                name = Regex.Replace(name, @"\s+", " ").Trim();
                if (!string.IsNullOrWhiteSpace(name))
                {
                    prices.Add(new PriceItem { Name = name, Price = $"{priceStr} руб" });
                }
            }
        }

        return prices;
    }

    private static List<string> ExtractPhotos(HtmlDocument doc)
    {
        var urls = new List<string>();
        var imgs = doc.DocumentNode.SelectNodes("//img[contains(@src,'/media/photo/')]");
        if (imgs is null) return urls;

        foreach (var img in imgs)
        {
            var src = img.GetAttributeValue("src", "");
            if (!string.IsNullOrWhiteSpace(src))
            {
                urls.Add(src.StartsWith("http") ? src : $"{BaseUrl}{src}");
            }
        }

        return urls;
    }

    private static List<string> ExtractTags(HtmlDocument doc)
    {
        // Look for tags after "Теги:"
        var text = ExtractAfterLabel(doc, "Теги:");
        if (string.IsNullOrWhiteSpace(text)) return [];

        return text.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(t => t.Trim().ToLowerInvariant())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct()
            .ToList();
    }

    private static double? ExtractWallArea(HtmlDocument doc)
    {
        var match = WallAreaRegex().Match(doc.DocumentNode.InnerText);
        return match.Success && double.TryParse(match.Groups[1].Value,
            System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture,
            out var val) ? val : null;
    }

    private static double? ExtractMaxHeight(HtmlDocument doc)
    {
        var match = MaxHeightRegex().Match(doc.DocumentNode.InnerText);
        return match.Success && double.TryParse(match.Groups[1].Value,
            System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture,
            out var val) ? val : null;
    }

    private static int? ExtractYearFounded(HtmlDocument doc)
    {
        var match = YearFoundedRegex().Match(doc.DocumentNode.InnerText);
        return match.Success && int.TryParse(match.Groups[1].Value, out var val) ? val : null;
    }

    private static List<string> ExtractMetroStations(HtmlDocument doc)
    {
        var stations = new List<string>();
        var text = ExtractAfterLabel(doc, "Станции метро:");
        if (string.IsNullOrWhiteSpace(text)) return stations;

        // Each station is typically a link
        var links = doc.DocumentNode.SelectNodes("//a[contains(@href,'/metro/')]");
        if (links is not null)
        {
            foreach (var a in links)
            {
                var station = a.InnerText.Trim();
                if (!string.IsNullOrWhiteSpace(station))
                    stations.Add(station);
            }
        }

        return stations.Distinct().ToList();
    }

    // ── Helpers ──

    /// <summary>
    /// Extracts text after a label (e.g. "Адрес:") from the HTML.
    /// </summary>
    private static string? ExtractAfterLabel(HtmlDocument doc, string label)
    {
        var text = doc.DocumentNode.InnerText;
        var idx = text.IndexOf(label, StringComparison.OrdinalIgnoreCase);
        if (idx < 0) return null;

        var after = text[(idx + label.Length)..].TrimStart();
        // Take until next line or next known label
        var endIdx = after.IndexOf('\n');
        return endIdx > 0 ? after[..endIdx].Trim() : after;
    }

    /// <summary>
    /// Returns all text content from the section following the given heading.
    /// Stops at the next h2-level heading (##) or known section markers.
    /// </summary>
    private static string? ExtractSectionText(HtmlDocument doc, string sectionHeading)
    {
        var text = doc.DocumentNode.InnerText;
        var idx = text.IndexOf(sectionHeading, StringComparison.OrdinalIgnoreCase);
        if (idx < 0) return null;

        var after = text[(idx + sectionHeading.Length)..].Trim();
        // Stop at next section heading (## SectionName) or known section markers
        var endMatch = Regex.Match(after, @"\n{2,}\s*(?:Фото|Отзывы|Другие|Адреса|Аккаунты|Дополнительная|Оставить|Карта|Прайс|©)");
        if (endMatch.Success)
        {
            after = after[..endMatch.Index].Trim();
        }

        // Also strip trailing garbage like "Аккаунты в социальных сетях:"
        var socialIdx = after.IndexOf("Аккаунты", StringComparison.Ordinal);
        if (socialIdx > 0) after = after[..socialIdx].Trim();

        return after;
    }

    [GeneratedRegex(@"Площадь стен:\s*([\d.]+)\s*м²")]
    private static partial Regex WallAreaRegex();

    [GeneratedRegex(@"Макс\.\s*высота:\s*([\d.]+)\s*м")]
    private static partial Regex MaxHeightRegex();

    [GeneratedRegex(@"Год основания\s*(\d{4})")]
    private static partial Regex YearFoundedRegex();

    [GeneratedRegex(@"([^\d]+?)\s*(\d+[\s\d]*)\s*руб")]
    private static partial Regex PriceItemRegex();

    [GeneratedRegex(@"^\s*(.+?)\s{2,}(\d[\d\s]*руб)$")]
    private static partial Regex PriceLineRegex();
}
