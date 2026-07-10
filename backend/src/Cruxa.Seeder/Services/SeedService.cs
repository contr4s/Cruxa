using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Infrastructure.Persistence;
using Cruxa.Seeder.Generators;
using Cruxa.Application.Features.Statistics.Services;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Seeder.Services;

public class SeedService
{
    private readonly CruxaDbContext _db;
    private readonly KruscoreService _kruscore;

    public SeedService(CruxaDbContext db, KruscoreService kruscore)
    {
        _db = db;
        _kruscore = kruscore;
    }

    public async Task SeedAsync()
    {
        Console.WriteLine("🚀 Starting seed...");

        // ── Step 1: Gyms ──
        Console.Write("📦 Gyms... ");
        var gymsDataDir = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "data");
        var gyms = GymGenerator.Generate(gymsDataDir);
        _db.Gyms.AddRange(gyms);
        await _db.SaveChangesAsync();
        Console.WriteLine($"{gyms.Count} created");

        // ── Step 2-3: Users + Credentials + Assignments ──
        Console.Write("👤 Users... ");
        var (users, creds, staffMap) = UserGenerator.Generate();
        var climbers = users.Where(u => u.Role == Role.Climber).ToList();
        _db.Users.AddRange(users);
        _db.PasswordCredentials.AddRange(creds);
        await _db.SaveChangesAsync();
        Console.WriteLine($"{users.Count} created, {creds.Count} credentials");

        Console.Write("🔗 GymAssignments... ");
        var assignments = new List<GymAssignment>();
        foreach (var (userId, gymIdx, isAdmin, isSetter) in staffMap)
        {
            if (isAdmin)
                assignments.Add(GymAssignment.Create(gyms[gymIdx].Id, userId, GymRoleInGym.GymAdmin).Value!);
            if (isSetter)
                assignments.Add(GymAssignment.Create(gyms[gymIdx].Id, userId, GymRoleInGym.Routesetter).Value!);
        }
        _db.GymAssignments.AddRange(assignments);
        await _db.SaveChangesAsync();
        Console.WriteLine($"{assignments.Count} created");

        // ── Step 4: Routes + Tags ──
        Console.Write("🧗 Routes... ");
        var existingTags = await _db.Tags.ToListAsync();
        var routes = RouteGenerator.Generate(gyms, staffMap, existingTags);

        // Add route-tag relationships
        foreach (var route in routes)
        {
            _db.Routes.Add(route);
            foreach (var tag in route.Tags)
            {
                // Tag is already tracked by the context if it's from existingTags
                if (existingTags.Any(t => t.Id == tag.Id))
                    _db.Entry(tag).State = EntityState.Unchanged;
            }
        }
        await _db.SaveChangesAsync();
        Console.WriteLine($"{routes.Count} created");

        // ── Step 5-8: For each user, generate+save+publish posts sequentially ──
        Console.Write("📝 Generating and publishing posts... ");
        var postBatches = PostGenerator.Generate(climbers, gyms, routes);
        var allPosts = new List<Post>();
        var allAscents = new List<Ascent>();

        foreach (var (user, batches) in postBatches)
        {
            foreach (var (post, ascents) in batches)
            {
                allPosts.Add(post);
                allAscents.AddRange(ascents);

                // Draft first
                _db.Posts.Add(post);
                foreach (var ascent in ascents)
                    _db.Ascents.Add(ascent);
                await _db.SaveChangesAsync();

                // Publish — triggers KruscoreService.RecalculateAsync
                post.Publish();
                var date = DateOnly.FromDateTime(post.CreatedAt);
                var delta = await _kruscore.RecalculateAsync(user.Id, date);
                post.SetDeltaKruskor(delta);
            }
        }
        Console.WriteLine($"{allPosts.Count} posts, {allAscents.Count} ascents");

        // ── Step 9: Social (followers, likes, comments, feedbacks, favorites) ──
        Console.Write("❤️ Social... ");
        var (followers, likes, comments, feedbacks, favoriteGyms) = SocialGenerator.Generate(climbers, allPosts, routes, gyms);
        _db.Followers.AddRange(followers);
        _db.Likes.AddRange(likes);
        _db.Comments.AddRange(comments);
        _db.Set<RouteFeedback>().AddRange(feedbacks);
        _db.Set<UserFavoriteGym>().AddRange(favoriteGyms);
        await _db.SaveChangesAsync();
        Console.WriteLine($"followers:{followers.Count} likes:{likes.Count} comments:{comments.Count} feedbacks:{feedbacks.Count} favorites:{favoriteGyms.Count}");

        Console.WriteLine($"\n✅ Seed complete! Gyms:{gyms.Count} Users:{users.Count} Routes:{routes.Count} Posts:{allPosts.Count} Ascents:{allAscents.Count}");
    }

    public async Task ClearAsync()
    {
        Console.Write("🧹 Clearing seed data... ");

        _db.UserScoreSnapshots.RemoveRange(await _db.UserScoreSnapshots.ToListAsync());
        _db.Set<RouteFeedback>().RemoveRange(await _db.Set<RouteFeedback>().ToListAsync());
        _db.Set<UserFavoriteGym>().RemoveRange(await _db.Set<UserFavoriteGym>().ToListAsync());
        _db.Comments.RemoveRange(await _db.Comments.ToListAsync());
        _db.Likes.RemoveRange(await _db.Likes.ToListAsync());
        _db.Followers.RemoveRange(await _db.Followers.ToListAsync());
        _db.Ascents.RemoveRange(await _db.Ascents.ToListAsync());
        _db.Posts.RemoveRange(await _db.Posts.ToListAsync());
        _db.Routes.RemoveRange(await _db.Routes.ToListAsync());
        _db.GymAssignments.RemoveRange(await _db.GymAssignments.ToListAsync());
        _db.PasswordCredentials.RemoveRange(await _db.PasswordCredentials.ToListAsync());

        // Delete seed users (non-Admin whose email ends with @cruxa.seed)
        // Materialize first since Email VO can't be translated
        var allUsers = await _db.Users.ToListAsync();
        var seedUsers = allUsers
            .Where(u => u.Role != Role.Admin && u.Email.Value.EndsWith("@cruxa.seed"))
            .ToList();
        _db.Users.RemoveRange(seedUsers);

        // Delete seed gyms (all gyms except those created with non-seed data)
        // We can identify seed gyms as those created by seeder (not parsed + synthetic)
        // For simplicity, keep gyms — user can re-seed
        // Actually delete all gyms that don't have the grading system reference or are seed
        // Safest: delete gyms that have @cruxa.seed in contact email OR are IsParsed=false
        var allGyms = await _db.Gyms.ToListAsync();
        // Just delete all — the admin can re-import parser gyms
        // But keep gyms with a real ContactEmail that's not @cruxa.seed
        var seedGyms = allGyms.Where(g =>
            string.IsNullOrEmpty(g.ContactEmail) ||
            g.ContactEmail.EndsWith("@cruxa.seed") ||
            !g.IsParsed).ToList();
        _db.Gyms.RemoveRange(seedGyms);

        await _db.SaveChangesAsync();

        Console.WriteLine("done");
    }
}
