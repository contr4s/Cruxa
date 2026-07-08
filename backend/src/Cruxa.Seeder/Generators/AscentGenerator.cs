using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;

namespace Cruxa.Seeder.Generators;

public static class AscentGenerator
{
    /// <summary>
    /// Generates 3–5 ascents per published post, using a mix of styles.
    /// </summary>
    public static List<Ascent> Generate(List<Post> posts, List<Route> routes, List<User> climbers)
    {
        var ascents = new List<Ascent>();
        var faker = new Faker("ru");

        var routeIds = routes.Select(r => r.Id).ToList();
        var climberIds = climbers.Select(u => u.Id).ToList();

        var styles = new[] { AscentStyle.Onsight, AscentStyle.Flash, AscentStyle.Redpoint, AscentStyle.TopRope, AscentStyle.Attempt };
        var styleWeights = new[] { 0.05, 0.20, 0.35, 0.25, 0.15 };

        foreach (var post in posts)
        {
            if (post.Status != PostStatus.Published) continue;

            // Routes in this post should be from the same gym as the post
            var gymRoutes = routes.Where(r => r.GymId == post.GymId).Select(r => r.Id).ToList();
            if (gymRoutes.Count == 0) continue;

            var count = faker.Random.Int(3, Math.Min(5, gymRoutes.Count));
            var selectedRoutes = faker.PickRandom(gymRoutes, count);

            foreach (var routeId in selectedRoutes)
            {
                var style = PickWeighted(faker, styles, styleWeights);
                var ascentTags = faker.PickRandom(new[]
                {
                    "climbing,ascent", "climbing,move", "climbing,action",
                    "climbing,feet", "climbing,hand", "climbing,dynamic"
                });
                var ascent = Ascent.Create(
                    post.Id,
                    post.UserId,
                    routeId,
                    style,
                    mediaUrls: faker.Random.Bool(0.5f)
                        ? [$"https://loremflickr.com/400/300/{ascentTags}?random=a{ascents.Count}"]
                        : []).Value!;

                ascents.Add(ascent);
            }
        }

        return ascents;
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
