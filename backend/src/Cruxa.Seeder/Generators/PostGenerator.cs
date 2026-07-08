using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;

namespace Cruxa.Seeder.Generators;

public static class PostGenerator
{
    /// <summary>
    /// Генерирует ~250 постов: активные климберы ~6, казуальные ~3, новые ~1–2.
    /// </summary>
    public static List<Post> Generate(List<User> climbers, List<Gym> gyms)
    {
        var posts = new List<Post>();
        var faker = new Faker("ru");

        foreach (var user in climbers)
        {
            // Determine how many posts for this user based on activity distribution
            var activityLevel = faker.Random.Int(1, 100);
            int postCount = activityLevel switch
            {
                <= 15 => faker.Random.Int(6, 10),   // top 15% — very active
                <= 40 => faker.Random.Int(3, 6),    // next 25% — active
                <= 70 => faker.Random.Int(1, 3),    // next 30% — casual
                _ => faker.Random.Int(0, 2)          // bottom 30% — occasional
            };

            // Filter gyms by user's city, or use all if city not set
            var cityGyms = string.IsNullOrEmpty(user.City)
                ? gyms
                : gyms.Where(g => g.City == user.City).ToList();
            if (cityGyms.Count == 0) cityGyms = gyms;

            for (var p = 0; p < postCount; p++)
            {
                var gym = faker.PickRandom(cityGyms);
                var daysAgo = faker.Random.Int(1, 90);
                var createdAt = DateTime.UtcNow.AddDays(-daysAgo)
                    .AddHours(faker.Random.Int(8, 23))
                    .AddMinutes(faker.Random.Int(0, 59));

                var postTags = faker.PickRandom(new[]
                {
                    "climbing,person", "climbing,action", "climbing,wall",
                    "climbing,bouldering", "climbing,training", "climbing,competition",
                    "rock,climbing,outdoor", "climbing,gym,inside"
                });
                var post = Post.Create(
                    user.Id,
                    gym.Id,
                    description: ClimbingPhrases.RandomPostDescription(),
                    mediaUrls: faker.Random.Bool(0.7f)
                        ? Enumerable.Range(0, faker.Random.Int(1, 3))
                            .Select(i => $"https://loremflickr.com/800/600/{postTags}?random={user.Username}_{p}_{i}")
                            .ToList()
                        : [],
                    duration: faker.Random.Int(30, 180)).Value!;

                // Set visibility
                var visibilityRoll = faker.Random.Int(1, 100);
                PostVisibility visibility = visibilityRoll switch
                {
                    <= 75 => PostVisibility.Public,
                    <= 90 => PostVisibility.Followers,
                    _ => PostVisibility.Private
                };
                SetPrivateField(post, "_visibility", visibility);

                // Most posts are published
                var statusRoll = faker.Random.Int(1, 100);
                if (statusRoll <= 93)
                {
                    post.Publish();
                }

                SetPrivateField(post, "_createdAt", createdAt);

                posts.Add(post);
            }
        }

        return posts;
    }

    private static void SetPrivateField<T>(object obj, string name, T value)
    {
        var f = obj.GetType().GetField(name, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);
        if (f is not null) f.SetValue(obj, value);
    }
}
