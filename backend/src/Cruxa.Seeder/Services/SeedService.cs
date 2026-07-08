using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Infrastructure.Persistence;
using Cruxa.Seeder.Generators;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Seeder.Services;

public class SeedService
{
    private readonly CruxaDbContext _db;

    public SeedService(CruxaDbContext db)
    {
        _db = db;
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
        var staffByGym = staffMap
            .GroupBy(s => s.gymIndex)
            .ToDictionary(g => g.Key, g => g.First());
        var routes = RouteGenerator.Generate(gyms, staffByGym, existingTags);

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

        // ── Step 5: Posts ──
        Console.Write("📝 Posts... ");
        var posts = PostGenerator.Generate(climbers, gyms);
        _db.Posts.AddRange(posts);
        await _db.SaveChangesAsync();
        Console.WriteLine($"{posts.Count} created");

        // ── Step 6: Ascents ──
        Console.Write("⛰️ Ascents... ");
        var ascents = AscentGenerator.Generate(posts, routes, climbers);
        _db.Ascents.AddRange(ascents);
        await _db.SaveChangesAsync();
        Console.WriteLine($"{ascents.Count} created");

        // ── Step 7: Social (followers, likes, comments, reviews) ──
        Console.Write("❤️ Social... ");
        var (followers, likes, comments, reviews) = SocialGenerator.Generate(climbers, posts, routes);
        _db.Followers.AddRange(followers);
        _db.Likes.AddRange(likes);
        _db.Comments.AddRange(comments);
        _db.RouteReviews.AddRange(reviews);
        await _db.SaveChangesAsync();
        Console.WriteLine($"followers:{followers.Count} likes:{likes.Count} comments:{comments.Count} reviews:{reviews.Count}");

        // ── Step 8: Kruscore recalculation ──
        Console.Write("📊 Kruscore... ");
        var activeUsers = climbers
            .Where(u => posts.Any(p => p.UserId == u.Id && p.Status == PostStatus.Published))
            .ToList();

        var lastDates = posts
            .Where(p => p.Status == PostStatus.Published)
            .GroupBy(p => p.UserId)
            .ToDictionary(g => g.Key, g => g.Max(p => DateOnly.FromDateTime(p.CreatedAt)));

        var recalculated = 0;
        foreach (var user in activeUsers)
        {
            if (!lastDates.TryGetValue(user.Id, out var lastDate)) continue;

            // Load all ascents with routes for Kruscore
            var allAscents = await _db.Ascents
                .Include(a => a.Route)
                .Where(a => a.UserId == user.Id)
                .OrderBy(a => a.CreatedAt)
                .ToListAsync();

            if (allAscents.Count == 0) continue;

            var totalW = allAscents.Sum(a => Domain.Services.KruscoreCalculator.RouteTypeWeight(a.Route.Type));
            if (totalW < 15) continue;

            var theta = Domain.Services.KruscoreCalculator.PerformanceRating(allAscents);
            var confidence = allAscents.Count;
            var maxGrade = allAscents.Max(a => a.Route.Grade.Index);

            var snapshot = new UserScoreSnapshot(user.Id, lastDate, theta, confidence, maxGrade);
            _db.UserScoreSnapshots.Add(snapshot);
            recalculated++;
        }
        await _db.SaveChangesAsync();
        Console.WriteLine($"{recalculated} users scored");

        Console.WriteLine($"\n✅ Seed complete! Gyms:{gyms.Count} Users:{users.Count} Routes:{routes.Count} Posts:{posts.Count} Ascents:{ascents.Count}");
    }

    public async Task ClearAsync()
    {
        Console.Write("🧹 Clearing seed data... ");

        _db.UserScoreSnapshots.RemoveRange(await _db.UserScoreSnapshots.ToListAsync());
        _db.RouteReviews.RemoveRange(await _db.RouteReviews.ToListAsync());
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
