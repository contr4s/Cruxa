using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Domain.ValueObjects;
using Cruxa.Seeder.Helpers;

namespace Cruxa.Seeder.Generators;

public static class RouteGenerator
{
    // 21 Fontainbleau grades with their indices
    private static readonly (string Name, int Index)[] GradeTable =
    [
        ("4a", 400), ("4b", 420), ("4c", 440),
        ("5a", 460), ("5b", 480), ("5c", 500),
        ("6a", 520), ("6a+", 540), ("6b", 560),
        ("6b+", 580), ("6c", 600), ("6c+", 620),
        ("7a", 640), ("7a+", 660), ("7b", 680),
        ("7b+", 700), ("7c", 720), ("7c+", 740),
        ("8a", 760), ("8a+", 780), ("8b", 800),
    ];

    // Mean grade for normal distribution: ~6b (index 560)
    private const double GradeMean = 560;
    // StdDev ~1.5 grades (30 index points)
    private const double GradeStdDev = 30;

    private static readonly (string Name, double Weight)[] SectorWeights =
    {
        ("Боулдер-зона A", 0.25), ("Боулдер-зона B", 0.20), ("Боулдер-зона C", 0.15),
        ("Основной стенд", 0.20), ("Левый зал", 0.10), ("Правый зал", 0.10),
    };

    /// <summary>
    /// Генерирует 20 трасс на зал.
    /// </summary>
    public static List<Route> Generate(
        List<Gym> gyms,
        List<(Guid userId, int gymIndex, bool isAdmin, bool isSetter)> staffMap,
        List<Tag> existingTags)
    {
        var routes = new List<Route>();
        var faker = new Faker("ru");

        var gradeMapping = GradeMapping.Create(GradeTable.ToDictionary(g => g.Name, g => g.Index)).Value;

        var routeTypes = new[] { RouteType.Bouldering, RouteType.Lead, RouteType.Speed };
        var typeWeights = new[] { 0.60, 0.25, 0.15 };

        var holdColors = Enum.GetValues<HoldColor>();

        // Collect all setter IDs for fallback
        var allSetters = staffMap.Where(s => s.isSetter).Select(s => s.userId).ToList();

        foreach (var gym in gyms)
        {
            var gymIdx = gyms.IndexOf(gym);
            Guid? setterId;
            var gymStaff = staffMap.FirstOrDefault(s => s.gymIndex == gymIdx && s.isSetter);
            if (gymStaff.userId != default)
                setterId = gymStaff.userId;
            else if (allSetters.Count > 0)
                setterId = allSetters[faker.Random.Int(0, allSetters.Count - 1)];
            else
                setterId = null;

            var usedNames = new HashSet<string>();
            // 50-80 routes per gym (normal distribution around 60)
            var count = NormalDistribution.SampleInt(faker.Random, 60, 12, 50, 80);

            for (var r = 0; r < count; r++)
            {
                // Grade from normal distribution around 6b, clip to grade table bounds
                var gradeIndex = NormalDistribution.SampleInt(faker.Random, GradeMean, GradeStdDev, GradeTable[0].Index, GradeTable[^1].Index);
                // Find closest matching grade
                var gradeEntry = GradeTable.OrderBy(g => Math.Abs(g.Index - gradeIndex)).First();
                var grade = gradeMapping.ResolveGrade(gradeEntry.Name).Value;

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
