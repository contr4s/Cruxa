using Bogus;
using Cruxa.Domain.Entities;

namespace Cruxa.Seeder.Generators;

public static class SocialGenerator
{
    /// <summary>
    /// Generates followers, likes, comments, and route reviews.
    /// </summary>
    public static (
        List<Follower> Followers,
        List<Like> Likes,
        List<Comment> Comments,
        List<RouteReview> Reviews)
        Generate(List<User> climbers, List<Post> posts, List<Route> routes)
    {
        var faker = new Faker("ru");
        var userIds = climbers.Select(u => u.Id).ToList();

        // ── Followers: each climber follows 5–15 random others ──
        var followers = new List<Follower>();
        var seen = new HashSet<(Guid, Guid)>();

        foreach (var user in climbers)
        {
            var others = userIds.Where(id => id != user.Id).ToList();
            if (others.Count == 0) continue;
            var count = faker.Random.Int(5, Math.Min(15, others.Count));
            var targets = faker.PickRandom(others, count).ToList();

            foreach (var target in targets)
            {
                if (seen.Add((user.Id, target)))
                {
                    followers.Add(Follower.Create(user.Id, target).Value!);
                }
            }
        }

        // ── Likes: 60–80% of posts get 1–15 likes ──
        var likes = new List<Like>();
        var liked = new HashSet<(Guid, Guid)>(); // (PostId, UserId)

        foreach (var post in posts)
        {
            if (faker.Random.Bool(0.25f)) continue; // skip 25% of posts

            var likers = faker.PickRandom(userIds, faker.Random.Int(1, Math.Min(15, userIds.Count))).ToList();
            foreach (var liker in likers)
            {
                if (liked.Add((post.Id, liker)))
                {
                    likes.Add(Like.Create(post.Id, liker).Value!);
                }
            }
        }

        // ── Comments: on ~25% of posts ──
        var comments = new List<Comment>();
        foreach (var post in posts)
        {
            if (!faker.Random.Bool(0.25f)) continue;

            var count = faker.Random.Int(1, 4);
            var commenters = faker.PickRandom(userIds, Math.Min(count, userIds.Count)).ToList();
            foreach (var commenter in commenters)
            {
                comments.Add(Comment.Create(
                    post.Id,
                    commenter,
                    faker.Lorem.Sentence(faker.Random.Int(3, 12))).Value!);
            }
        }

        // ── Route reviews: ~60% of routes get 1–3 reviews ──
        var reviews = new List<RouteReview>();
        var reviewed = new HashSet<(Guid, Guid)>(); // (RouteId, UserId)

        foreach (var route in routes)
        {
            if (!faker.Random.Bool(0.6f)) continue;

            var count = faker.Random.Int(1, 3);
            var reviewers = faker.PickRandom(userIds, Math.Min(count, userIds.Count)).ToList();
            foreach (var reviewer in reviewers)
            {
                if (reviewed.Add((route.Id, reviewer)))
                {
                    reviews.Add(RouteReview.Create(
                        route.Id,
                        reviewer,
                        faker.Random.Int(1, 5),
                        privateNotes: faker.Random.Bool(0.3f) ? faker.Lorem.Sentence(5) : null,
                        publicReview: faker.Random.Bool(0.5f) ? faker.Lorem.Sentence(8) : null).Value!);
                }
            }
        }

        return (followers, likes, comments, reviews);
    }
}
