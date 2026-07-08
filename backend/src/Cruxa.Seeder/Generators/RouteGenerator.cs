using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Domain.ValueObjects;

namespace Cruxa.Seeder.Generators;

public static class RouteGenerator
{
    private static readonly string[] GradeKeys = [
        "5c","6a","6a+","6b","6b+","6c","6c+",
        "7a","7a+","7b","7b+","7c","7c+","8a"
    ];

    private static readonly (string Name, double Weight)[] SectorWeights =
    {
        ("Боулдер-зона A", 0.25), ("Боулдер-зона B", 0.20), ("Боулдер-зона C", 0.15),
        ("Основной стенд", 0.20), ("Левый зал", 0.10), ("Правый зал", 0.10),
    };

    /// <summary>
    /// Генерирует ~50 трасс, распределённых по залам (по 5 на зал).
    /// </summary>
    public static List<Route> Generate(
        List<Gym> gyms,
        Dictionary<int, (Guid userId, int gymIndex, bool isAdmin, bool isSetter)> staffByGymIndex,
        List<Tag> existingTags)
    {
        var routes = new List<Route>();
        var faker = new Faker("ru");

        var gradeMapping = GradeMapping.Create(new Dictionary<string, int>
        {
            ["5c"] = 500, ["6a"] = 520, ["6a+"] = 540, ["6b"] = 560, ["6b+"] = 580,
            ["6c"] = 600, ["6c+"] = 620, ["7a"] = 640, ["7a+"] = 660, ["7b"] = 680,
            ["7b+"] = 700, ["7c"] = 720, ["7c+"] = 740, ["8a"] = 760,
        }).Value;

        var routeTypes = new[] { RouteType.Bouldering, RouteType.Lead, RouteType.Speed };
        var typeWeights = new[] { 0.60, 0.25, 0.15 };

        var holdColors = Enum.GetValues<HoldColor>();

        foreach (var gym in gyms)
        {
            var gymIdx = gyms.IndexOf(gym);
            var setterId = staffByGymIndex.TryGetValue(gymIdx, out var staff) && staff.isSetter
                ? staff.userId
                : (Guid?)null;

            var usedNames = new HashSet<string>();

            var count = gymIdx switch
            {
                // More routes for first gyms
                0 or 1 => 6, 2 or 3 => 5, _ => 4
            };

            for (var r = 0; r < count; r++)
            {
                var gradeRaw = faker.PickRandom(GradeKeys);
                var grade = gradeMapping.ResolveGrade(gradeRaw).Value;

                var type = PickWeighted(faker, routeTypes, typeWeights);
                var holdColor = faker.PickRandom(holdColors);
                var sector = PickWeighted(faker,
                    SectorWeights.Select(s => s.Name).ToArray(),
                    SectorWeights.Select(s => s.Weight).ToArray());

                var photoPool = new[]
                {
                    $"https://loremflickr.com/400/300/climbing,hold?random=r{routes.Count + r}_a",
                    $"https://loremflickr.com/400/300/climbing,hand?random=r{routes.Count + r}_b",
                    $"https://loremflickr.com/400/300/climbing,detail?random=r{routes.Count + r}_c",
                    $"https://loremflickr.com/400/300/climbing,color?random=r{routes.Count + r}_d",
                    $"https://loremflickr.com/400/300/rock,wall?random=r{routes.Count + r}_e",
                };
                var route = Route.Create(
                    gym.Id,
                    grade,
                    type,
                    holdColor,
                    name: ClimbingPhrases.RandomRouteName(usedNames),
                    authorId: setterId,
                    photoUrls: faker.Random.Bool(0.7f)
                        ? [faker.PickRandom(photoPool)]
                        : [],
                    tags: PickRandomTags(faker, existingTags),
                    sector: sector).Value!;

                // 10% inactive
                if (faker.Random.Bool(0.1f))
                    route.Deactivate();

                routes.Add(route);
            }
        }

        return routes;
    }

    private static List<Tag> PickRandomTags(Faker f, List<Tag> tags)
    {
        var count = f.Random.Int(1, 3);
        return f.PickRandom(tags, Math.Min(count, tags.Count)).ToList();
    }

    private static T PickWeighted<T>(Faker f, T[] items, double[] weights)
    {
        var r = f.Random.Double();
        var cumulative = 0.0;
        for (var i = 0; i < items.Length; i++)
        {
            cumulative += weights[i];
            if (r < cumulative) return items[i];
        }
        return items[^1];
    }
}
