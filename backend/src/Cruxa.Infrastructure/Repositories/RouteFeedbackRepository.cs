using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

internal class RouteFeedbackRepository : IRouteFeedbackRepository
{
    private readonly CruxaDbContext _db;

    public RouteFeedbackRepository(CruxaDbContext db) => _db = db;

    public async Task<RouteFeedback?> GetByIdAsync(Guid id)
        => await _db.RouteFeedbacks
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

    public async Task<RouteFeedback?> GetByRouteAndUserAsync(Guid routeId, Guid userId)
        => await _db.RouteFeedbacks
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.RouteId == routeId && r.UserId == userId);

    public async Task<IEnumerable<RouteFeedback>> GetByRouteIdAsync(Guid routeId)
        => await _db.RouteFeedbacks
            .Include(r => r.User)
            .Where(r => r.RouteId == routeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task<(List<RouteFeedback> Items, int TotalCount)> GetPagedByRouteIdAsync(Guid routeId, int page, int pageSize)
    {
        var query = _db.RouteFeedbacks
            .Include(r => r.User)
            .Where(r => r.RouteId == routeId);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
    }

    public async Task<IEnumerable<RouteFeedback>> GetByUserIdAsync(Guid userId)
        => await _db.RouteFeedbacks
            .Include(r => r.Route)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

    public async Task<List<(int GradeIndex, int Count)>> GetGradeDistributionAsync(Guid routeId)
        => await _db.RouteFeedbacks
            .Where(r => r.RouteId == routeId && r.GradeIndex != null)
            .GroupBy(r => r.GradeIndex!.Value)
            .Select(g => new ValueTuple<int, int>(g.Key, g.Count()))
            .ToListAsync();

    public async Task<int?> GetUserGradeVoteAsync(Guid routeId, Guid userId)
        => (await _db.RouteFeedbacks
            .Where(r => r.RouteId == routeId && r.UserId == userId && r.GradeIndex != null)
            .Select(r => (int?)r.GradeIndex)
            .FirstOrDefaultAsync());

    public async Task AddAsync(RouteFeedback feedback)
    {
        await _db.RouteFeedbacks.AddAsync(feedback);
    }

    public async Task UpdateAsync(RouteFeedback feedback)
    {
        _db.RouteFeedbacks.Update(feedback);
    }

    public async Task DeleteAsync(Guid id)
    {
        var feedback = await _db.RouteFeedbacks.FindAsync(id);
        if (feedback is not null)
        {
            _db.RouteFeedbacks.Remove(feedback);
        }
    }
}
