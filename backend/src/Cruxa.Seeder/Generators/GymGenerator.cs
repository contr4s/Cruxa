using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;
using Cruxa.Infrastructure.Persistence;

namespace Cruxa.Seeder.Generators;

public static class GymGenerator
{
    public static readonly string[] SelectedGymNames =
    [
        "ЦСКА",
        "ТОКИО",
        "RedPoint",
        "Limestone",
        "МГТУ им. Баумана",
        "RockZona",
        "Экстрим",
        "Соколиная скала",
        "Луч",
        "Северная стена",
        "Трамонтана",
        "Igels Club",
        "Неолит",
    ];

    /// <summary>
    /// Создаёт все залы из данных парсера. Только выбранные (SelectedGymNames) будут наполнены трассами.
    /// </summary>
    public static List<Gym> Generate(string gymsDataDir)
    {
        var allParsed = new List<ParsedGym>();

        foreach (var file in Directory.GetFiles(gymsDataDir, "gyms-*.json"))
        {
            var json = File.ReadAllText(file);
            var parsed = System.Text.Json.JsonSerializer.Deserialize<List<ParsedGym>>(json,
                new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            if (parsed is not null) allParsed.AddRange(parsed);
        }

        var gyms = new List<Gym>();
        var selected = new HashSet<string>(SelectedGymNames);

        foreach (var p in allParsed)
        {
            if (string.IsNullOrWhiteSpace(p.Name)) continue;

            var result = Gym.Create(
                p.Name!,
                p.City ?? "Город не указан",
                p.Address ?? "Адрес не указан",
                p.Latitude, p.Longitude);
            if (!result.IsSuccess) continue;

            var gym = result.Value;
            gym.Update(
                description: p.Description,
                contactInfo: p.ContactInfo,
                contactEmail: p.ContactEmail,
                socialLinks: p.SocialLinks,
                website: p.Website,
                prices: p.Prices,
                workingHours: p.WorkingHours,
                photoUrls: p.PhotoUrls,
                gradingSystemId: CruxaDbContext.DefaultGradingSystemId,
                wallArea: p.WallArea,
                maxHeight: p.MaxHeight,
                yearFounded: p.YearFounded,
                metroStations: p.MetroStations,
                tags: p.Tags);
            gym.MarkAsParsed();

            // Помечаем отобранные залы (для наполнения трассами)
            if (selected.Contains(p.Name!))
                gyms.Insert(0, gym); // selected first
            else
                gyms.Add(gym);
        }

        return gyms;
    }

    private class ParsedGym
    {
        public string? Name { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Description { get; set; }
        public string? ContactInfo { get; set; }
        public string? ContactEmail { get; set; }
        public List<string>? SocialLinks { get; set; }
        public string? Website { get; set; }
        public List<PriceItem>? Prices { get; set; }
        public List<WorkingHoursEntry>? WorkingHours { get; set; }
        public List<string>? PhotoUrls { get; set; }
        public double? WallArea { get; set; }
        public double? MaxHeight { get; set; }
        public int? YearFounded { get; set; }
        public List<string>? MetroStations { get; set; }
        public List<string>? Tags { get; set; }
    }
}
