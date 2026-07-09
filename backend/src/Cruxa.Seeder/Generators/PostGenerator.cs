using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;

namespace Cruxa.Seeder.Generators;

/// <summary>
/// Generates posts with coupled ascents (realistic session counts) per user.
/// Returns (Post, List&lt;Ascent&gt;) tuples — caller saves &amp; publishes sequentially.
/// </summary>
public static class PostGenerator
{
    private static readonly AscentStyle[] Styles = [AscentStyle.Onsight, AscentStyle.Flash, AscentStyle.Redpoint, AscentStyle.TopRope, AscentStyle.Attempt];
    private static readonly double[] StyleWeights = [0.05, 0.20, 0.35, 0.25, 0.15];
    private static readonly string[] PostTags = ["climbing,person", "climbing,action", "climbing,wall", "climbing,bouldering", "climbing,training", "climbing,competition", "rock,climbing,outdoor", "climbing,gym,inside"];

    /// <summary>
    /// For each climber generates post+ascent batches. Posts are OLDEST-first
    /// so sequential kruskor calibration works correctly.
    /// </summary>
    public static List<(User User, List<(Post Post, List<Ascent> Ascents)> Batches)> Generate(
        List<User> climbers, List<Gym> gyms, List<Route> routes)
    {
        var faker = new Faker("ru");
        var result = new List<(User, List<(Post, List<Ascent>)>)>();

        foreach (var user in climbers)
        {
            var cityGyms = string.IsNullOrEmpty(user.City)
                ? gyms
                : gyms.Where(g => g.City == user.City).ToList();
            if (cityGyms.Count == 0) cityGyms = gyms;

            var postCount = faker.Random.Int(4, 10);
            var dayOffsets = new HashSet<int>();
            while (dayOffsets.Count < postCount)
                dayOffsets.Add(faker.Random.Int(1, 90));

            // OLDEST first so calibration snapshot anchors earliest date
            var sortedDays = dayOffsets.OrderByDescending(d => d).ToList();

            var batches = new List<(Post, List<Ascent>)>();
            for (var p = 0; p < postCount; p++)
            {
                var gym = faker.PickRandom(cityGyms);
                var createdAt = DateTime.UtcNow.AddDays(-sortedDays[p])
                    .AddHours(faker.Random.Int(8, 23))
                    .AddMinutes(faker.Random.Int(0, 59));

                var post = Post.Create(
                    user.Id, gym.Id,
                    description: ClimbingPhrases.RandomPostDescription(),
                    mediaUrls: faker.Random.Bool(0.7f)
                        ? Enumerable.Range(0, faker.Random.Int(1, 3))
                            .Select(i => $"https://loremflickr.com/800/600/{faker.PickRandom(PostTags)}?random={user.Username}_{p}_{i}").ToList()
                        : [],
                    duration: faker.Random.Int(30, 180),
                    createdAt: createdAt).Value!;

                var gymRoutes = routes.Where(r => r.GymId == gym.Id).ToList();
                var ascents = GenerateAscents(faker, post.Id, user.Id, gymRoutes, createdAt);

                batches.Add((post, ascents));
            }

            result.Add((user, batches));
        }

        return result;
    }

    private static List<Ascent> GenerateAscents(Faker faker, Guid postId, Guid userId, List<Route> gymRoutes, DateTime createdAt)
    {
        if (gymRoutes.Count == 0) return [];

        var boulderRoutes = gymRoutes.Where(r => r.Type == RouteType.Bouldering).ToList();
        var leadRoutes = gymRoutes.Where(r => r.Type == RouteType.Lead).ToList();

        var sessionType = faker.Random.Int(1, 100);
        int ascentCount;
        List<Route> pool;

        if (sessionType <= 55) // bouldering session
        {
            pool = boulderRoutes.Count >= 3 ? boulderRoutes : gymRoutes;
            ascentCount = faker.Random.Int(15, 25);
        }
        else if (sessionType <= 80) // lead session
        {
            pool = leadRoutes.Count >= 3 ? leadRoutes : gymRoutes;
            ascentCount = faker.Random.Int(5, 9);
        }
        else // mixed
        {
            pool = gymRoutes;
            ascentCount = faker.Random.Int(8, 14);
        }

        ascentCount = Math.Min(ascentCount, pool.Count);
        if (ascentCount < 1) return [];

        return faker.PickRandom(pool, ascentCount).Select(route =>
        {
            var style = PickWeighted(faker, Styles, StyleWeights);
            return Ascent.Create(postId, userId, route.Id, style, createdAt: createdAt).Value!;
        }).ToList();
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
