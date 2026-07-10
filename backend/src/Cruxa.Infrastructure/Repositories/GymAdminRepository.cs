using Microsoft.EntityFrameworkCore;
using Cruxa.Application.Features.GymAdmin.Contracts;
using Cruxa.Application.Features.GymAdmin.DTOs;
using Cruxa.Infrastructure.Persistence;

namespace Cruxa.Infrastructure.Repositories;

public class GymAdminRepository : IGymAdminRepository
{
    private readonly CruxaDbContext _context;

    public GymAdminRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<GymActivityDto?> GetActivityAsync(Guid gymId)
    {
        var since = DateTime.UtcNow.AddDays(-30);

        var newRoutes = await _context.Routes.CountAsync(r => r.GymId == gymId && r.CreatedAt >= since);
        var ascents = await _context.Ascents.CountAsync(a => a.Route!.GymId == gymId && a.CreatedAt >= since);
        var reviews = await _context.RouteFeedbacks
            .CountAsync(f => f.Route!.GymId == gymId && f.CreatedAt >= since);
        var visitors = await _context.Ascents
            .Where(a => a.Route!.GymId == gymId && a.CreatedAt >= since)
            .Select(a => a.UserId)
            .Distinct()
            .CountAsync();

        return new GymActivityDto
        {
            NewRoutes = newRoutes,
            Ascents = ascents,
            Reviews = reviews,
            Visitors = visitors,
            Period = "30 дней",
        };
    }
}
