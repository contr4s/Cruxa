using Bogus;
using Cruxa.Domain.Entities;
using Cruxa.Seeder.Helpers;

namespace Cruxa.Seeder.Generators;

public static class SocialGenerator
{
    private static readonly string[] ReviewTemplates =
    [
        "Классная трасса, отлично проработана!",
        "Огонь! Обязательно попробуйте.",
        "Интересная последовательность движений.",
        "Зацепы скользкие, будьте аккуратны.",
        "Отличная трасса для прокачки техники.",
        "Динамичный старт, мощный финиш.",
        "Сложная, но очень логичная трасса.",
        "Одна из лучших в зале!",
        "Трасса на выносливость, отличная.",
        "Не понравилась — зацепы неудобные.",
        "Хороший warm-up вариант.",
        "Для проекта самое то, интересные перехваты.",
        "Классная трасса, пролез с первой попытки!",
        "Заход сложный, но после ключа всё идёт.",
    ];

    private static readonly string[] PrivateNoteTemplates =
    [
        "Ключ — правая рука на слоупере.",
        "Левой ногой на маленькую зацепку.",
        "Важно не спешить на первом перехвате.",
        "Нужно подкачать подтягивания для этой трассы.",
        "Попробовать другой выход на финиш.",
        "Сделать ногами перестановку перед ключом.",
        "Поработать над динамикой.",
        "Посмотреть бету у рутсеттера.",
        "Попробовать в следующий раз с другой обувью.",
        "Хорошо проработана последовательность.",
    ];

    /// <summary>
    /// Generates followers, likes, comments, route feedback, and gym favorites.
    /// </summary>
    public static (
        List<Follower> Followers,
        List<Like> Likes,
        List<Comment> Comments,
        List<RouteFeedback> Feedbacks,
        List<UserFavoriteGym> FavoriteGyms)
        Generate(List<User> climbers, List<Post> posts, List<Route> routes, List<Gym> gyms)
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
                    followers.Add(Follower.Create(user.Id, target).Value!);
            }
        }

        // ── Likes: 60–80% of posts get 1–15 likes ──
        var likes = new List<Like>();
        var liked = new HashSet<(Guid, Guid)>();

        foreach (var post in posts)
        {
            if (faker.Random.Bool(0.25f)) continue;

            var likers = faker.PickRandom(userIds, faker.Random.Int(1, Math.Min(15, userIds.Count))).ToList();
            foreach (var liker in likers)
            {
                if (liked.Add((post.Id, liker)))
                    likes.Add(Like.Create(post.Id, liker).Value!);
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
                comments.Add(Comment.Create(post.Id, commenter, faker.Lorem.Sentence(faker.Random.Int(3, 12))).Value!);
        }

        // ── Route feedback: ~60% of routes get 1–3 feedbacks ──
        var feedbacks = new List<RouteFeedback>();
        var reviewed = new HashSet<(Guid, Guid)>();

        foreach (var route in routes)
        {
            if (!faker.Random.Bool(0.6f)) continue;

            var count = faker.Random.Int(1, 3);
            var reviewers = faker.PickRandom(userIds, Math.Min(count, userIds.Count)).ToList();
            foreach (var reviewer in reviewers)
            {
                if (reviewed.Add((route.Id, reviewer)))
                {
                    var rating = NormalDistribution.SampleInt(faker.Random, 4.5, 0.5, 1, 5);
                    var gradeIndex = faker.Random.Bool(0.7f)
                        ? NormalDistribution.SampleInt(faker.Random, route.Grade.Index, 30, 400, 800)
                        : (int?)null;

                    feedbacks.Add(RouteFeedback.Create(
                        route.Id, reviewer,
                        rating: rating,
                        privateNotes: faker.Random.Bool(0.4f) ? faker.PickRandom(PrivateNoteTemplates) : null,
                        publicReview: faker.Random.Bool(0.6f) ? faker.PickRandom(ReviewTemplates) : null,
                        gradeIndex: gradeIndex).Value!);
                }
            }
        }

        // ── Gym favorites: each climber likes 1–3 random gyms ──
        var favoriteGyms = new List<UserFavoriteGym>();
        var favSeen = new HashSet<(Guid, Guid)>();

        foreach (var user in climbers)
        {
            var count = faker.Random.Int(1, Math.Min(3, gyms.Count));
            var targets = faker.PickRandom(gyms, count).ToList();
            foreach (var gym in targets)
            {
                if (favSeen.Add((user.Id, gym.Id)))
                    favoriteGyms.Add(UserFavoriteGym.Create(user.Id, gym.Id).Value!);
            }
        }

        return (followers, likes, comments, feedbacks, favoriteGyms);
    }
}
