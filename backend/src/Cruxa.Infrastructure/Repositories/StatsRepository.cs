
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class StatsRepository : IStatsRepository
{
    private readonly CruxaDbContext _context;

    public StatsRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<UserScoreSnapshot?> GetLastSnapshotBeforeAsync(Guid userId, DateOnly date)
    {
        return await _context.UserScoreSnapshots
            .Where(s => s.UserId == userId && s.Date <= date)
            .OrderByDescending(s => s.Date)
            .FirstOrDefaultAsync();
    }

    public async Task<List<UserScoreSnapshot>> GetSnapshotsAsync(Guid userId, DateOnly from, DateOnly to)
    {
        return await _context.UserScoreSnapshots
            .Where(s => s.UserId == userId && s.Date >= from && s.Date <= to)
            .OrderBy(s => s.Date)
            .ToListAsync();
    }

    public async Task UpsertSnapshotAsync(UserScoreSnapshot snapshot)
    {
        var existing = await _context.UserScoreSnapshots.FirstOrDefaultAsync(s =>
                s.UserId == snapshot.UserId && s.Date == snapshot.Date);

        if (existing is not null)
        {
            existing.Score         = snapshot.Score;
            existing.Confidence    = snapshot.Confidence;
            existing.MaxGradeIndex = snapshot.MaxGradeIndex;
            existing.MaxGradeRaw   = snapshot.MaxGradeRaw;
            existing.CreatedAt     = snapshot.CreatedAt;
        }
        else
        {
            _context.UserScoreSnapshots.Add(snapshot);
        }

        await _context.SaveChangesAsync();
    }

    public async Task<List<Ascent>> GetAscentsWithRoutesAsync(Guid userId)
    {
        return await _context.Ascents
            .Where(a => a.UserId == userId)
            .Include(a => a.Route)
            .ToListAsync();
    }

    public async Task<List<Ascent>> GetTopAscentsAsync(Guid userId, int count = 5)
    {
        return await _context.Ascents
            .Where(a => a.UserId == userId)
            .Include(a => a.Route).ThenInclude(r => r.Gym)
            .OrderByDescending(a => a.Route.Grade.Index)
            .Take(count)
            .ToListAsync();
    }

    public async Task<List<Post>> GetPostsInRangeAsync(Guid userId, DateTimeOffset from, DateTimeOffset to)
    {
        return await _context.Posts
            .Where(p => p.UserId == userId && p.CreatedAt >= from && p.CreatedAt < to)
            .Include(p => p.Ascents)
            .ThenInclude(a => a.Route)
            .ToListAsync();
    }

    public async Task<int> GetPublishedWorkoutsCountAsync(Guid userId)
    {
        return await _context.Posts
            .CountAsync(p => p.UserId == userId && p.Status == Domain.Enums.PostStatus.Published);
    }

    public async Task<int> GetTotalAscentsCountAsync(Guid userId)
    {
        return await _context.Ascents.CountAsync(a => a.UserId == userId);
    }

    public async Task<List<Ascent>> GetAscentsByDateAsync(Guid userId, DateOnly date)
    {
        var from = date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var to = date.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);
        return await _context.Ascents
            .Where(a => a.UserId == userId && a.CreatedAt >= from && a.CreatedAt <= to)
            .Include(a => a.Route)
            .ToListAsync();
    }

    public async Task<List<Ascent>> GetAllAscentsOrderedAsync(Guid userId)
    {
        return await _context.Ascents
            .Where(a => a.UserId == userId)
            .Include(a => a.Route)
            .OrderBy(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<RouteReview>> GetRouteReviewsAsync(Guid routeId)
    {
        return await _context.RouteReviews
            .Where(r => r.RouteId == routeId)
            .ToListAsync();
    }

    public async Task<Gym?> GetGymWithRoutesAsync(Guid gymId)
    {
        return await _context.Gyms
            .Include(g => g.Routes)
            .FirstOrDefaultAsync(g => g.Id == gymId);
    }

    public async Task<Route?> GetRouteWithAscentsAndReviewsAsync(Guid routeId)
    {
        return await _context.Routes
            .Include(r => r.Ascents)
            .Include(r => r.Reviews)
            .FirstOrDefaultAsync(r => r.Id == routeId);
    }

    public async Task<List<AscentWithRouteTags>> GetAscentsWithTagsAsync(Guid userId)
    {
        var ascents = await _context.Ascents
            .Where(a => a.UserId == userId)
            .Include(a => a.Route).ThenInclude(r => r.Tags)
            .ToListAsync();

        return ascents.Select(a => new AscentWithRouteTags(
            a.Id, a.RouteId, a.PostId, a.Route.Grade.Index,
            a.Style,
            a.Route.Type,
            a.CreatedAt,
            a.Route.Tags.Select(t => (t.Value, t.Category)).ToList()))
            .ToList();
    }
}

