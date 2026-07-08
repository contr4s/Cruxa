using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;
using Cruxa.Infrastructure.Persistence;

namespace Cruxa.Seeder.Generators;

public static class GymGenerator
{
    /// <summary>
    /// 10 залов: первые 5 из реальных данных парсера (Москва), остальные 5 синтетические (СПб).
    /// </summary>
    public static List<Gym> Generate(string gymsDataDir)
    {
        var gyms = new List<Gym>();

        // Load real Moscow gyms from parser data
        var moscowFile = Path.Combine(gymsDataDir, "gyms-moskva.json");
        if (File.Exists(moscowFile))
        {
            var json = File.ReadAllText(moscowFile);
            var parsed = System.Text.Json.JsonSerializer.Deserialize<List<ParsedGym>>(json);
            if (parsed is not null)
            {
                foreach (var p in parsed.Take(5))
                {
                    var name = p.Name ?? $"Москва Gym #{gyms.Count + 1}";
                    var result = Gym.Create(
                        name,
                        p.City ?? "Москва",
                        p.Address ?? "ул. Центральная, 1",
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
                    gyms.Add(gym);
                }
            }
        }

        // Generate synthetic SPb gyms
        var faker = new Faker("ru");
        var spbPrefixes = new[] { "Скалодром", "Скалы", "Вертикаль", "База", "Стена" };
        var spbSuffixes = new[] { "на Неве", "Спорт", "Про", "Экстрим", "Клуб" };
        var spbStreets = new[] { "Невский пр.", "ул. Рубинштейна", "пр. Большевиков", "ул. Садовая", "Лиговский пр." };

        while (gyms.Count < 10)
        {
            var idx = gyms.Count;
            var name = $"{faker.PickRandom(spbPrefixes)} {faker.PickRandom(spbSuffixes)} #{idx + 1}";
            var street = faker.PickRandom(spbStreets);
            var lat = 59.9 + faker.Random.Double() * 0.1;
            var lng = 30.3 + faker.Random.Double() * 0.1;

            var result = Gym.Create(name, "Санкт-Петербург", $"{street}, {faker.Random.Int(1, 50)}", lat, lng);
            if (!result.IsSuccess) continue;
            var gym = result.Value;
            gym.Update(
                description: $"Современный скалодром в Санкт-Петербурге. {faker.Lorem.Sentence(5)}",
                contactInfo: $"+7 (812) {faker.Random.Int(100, 999)}-{faker.Random.Int(10, 99)}-{faker.Random.Int(10, 99)}",
                website: $"https://gym{idx + 1}.ru",
                prices: new List<PriceItem>
                {
                    new() { Name = "Разовое", Price = $"{faker.Random.Int(400, 800)} руб" },
                    new() { Name = "Абонемент на месяц", Price = $"{faker.Random.Int(3000, 6000)} руб" },
                },
                workingHours: new List<WorkingHoursEntry>
                {
                    new() { Days = "пн-пт", From = new TimeOnly(8, 0), To = new TimeOnly(23, 0) },
                    new() { Days = "сб-вс", From = new TimeOnly(9, 0), To = new TimeOnly(22, 0) },
                },
                photoUrls: new List<string>
                {
                    $"https://loremflickr.com/800/600/climbing,gym?random=gym{idx + 1}_a",
                    $"https://loremflickr.com/800/600/climbing,bouldering?random=gym{idx + 1}_b",
                    $"https://loremflickr.com/800/600/climbing,wall?random=gym{idx + 1}_c",
                    $"https://loremflickr.com/800/600/climbing,competition?random=gym{idx + 1}_d",
                },
                gradingSystemId: CruxaDbContext.DefaultGradingSystemId);
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
