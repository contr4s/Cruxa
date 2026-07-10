using Microsoft.EntityFrameworkCore;
using Cruxa.Application.Features.Admin.Contracts;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Infrastructure.Persistence;

namespace Cruxa.Infrastructure.Repositories;

public class AdminRepository : IAdminRepository
{
    private readonly CruxaDbContext _context;

    public AdminRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<(int TotalGyms, int TotalRoutes, int TotalSetters, int MonthlyAscents)> GetStatsAsync()
    {
        var totalGyms = await _context.Gyms.CountAsync();
        var totalRoutes = await _context.Routes.CountAsync();
        var totalSetters = await _context.Users.CountAsync(u => u.Role == Domain.Enums.Role.Routesetter);
        var since = DateTime.UtcNow.AddDays(-30);
        var monthlyAscents = await _context.Ascents.CountAsync(a => a.CreatedAt >= since);

        return (totalGyms, totalRoutes, totalSetters, monthlyAscents);
    }

    public async Task<List<RecentActivityItemDto>> GetRecentActivityAsync(int count = 20)
    {
        var activities = new List<RecentActivityItemDto>();

        var recentGyms = await _context.Gyms
            .OrderByDescending(g => g.YearFounded ?? 0) // fallback — no CreatedAt on Gym
            .Take(10)
            .ToListAsync();

        activities.AddRange(recentGyms.Select(g => new RecentActivityItemDto
        {
            GymId = g.Id,
            GymName = g.Name,
            Event = $"Добавлен новый зал «{g.Name}»",
            Timestamp = DateTime.UtcNow, // no CreatedAt on Gym
            IsOnline = true,
        }));

        var recentPosts = await _context.Posts
            .Where(p => p.Status == Domain.Enums.PostStatus.Published)
            .OrderByDescending(p => p.CreatedAt)
            .Take(10)
            .ToListAsync();

        activities.AddRange(recentPosts.Select(p => new RecentActivityItemDto
        {
            GymName = null,
            Event = "Опубликована новая тренировка",
            Timestamp = p.CreatedAt,
            IsOnline = true,
        }));

        var recentUsers = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(10)
            .ToListAsync();

        activities.AddRange(recentUsers.Select(u => new RecentActivityItemDto
        {
            GymName = null,
            Event = $"Новый пользователь: {u.Username}",
            Timestamp = u.CreatedAt,
            IsOnline = false,
        }));

        return activities
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .ToList();
    }

    public async Task<List<TopGymItemDto>> GetTopGymsAsync(int count = 10)
    {
        return await _context.Gyms
            .Select(g => new TopGymItemDto
            {
                GymId = g.Id,
                GymName = g.Name,
                AscentsCount = g.Routes.SelectMany(r => r.Ascents).Count(),
            })
            .OrderByDescending(g => g.AscentsCount)
            .Take(count)
            .ToListAsync();
    }

    public async Task<(List<AdminGymItemDto> Items, int TotalCount)> GetGymsPagedAsync(
        int page, int pageSize, string? city, string? status, string? sort)
    {
        var query = _context.Gyms
            .Include(g => g.Routes)
                .ThenInclude(r => r.Ascents)
            .Include(g => g.Routes)
                .ThenInclude(r => r.Feedbacks)
            .AsQueryable();

        // Filter by city
        if (!string.IsNullOrWhiteSpace(city) && city != "all")
            query = query.Where(g => g.City != null && g.City.ToLower() == city.ToLower());

        // Filter by status
        if (status == "Active")
            query = query.Where(g => g.Routes.Any(r => r.IsActive));
        else if (status == "Pending")
            query = query.Where(g => !g.Routes.Any());

        // Sorting
        query = sort switch
        {
            "rating" => query.OrderByDescending(g => g.Routes.Average(r => r.Feedbacks.Average(f => f.Rating ?? 0))),
            "routes" => query.OrderByDescending(g => g.Routes.Count),
            "ascents" => query.OrderByDescending(g => g.Routes.SelectMany(r => r.Ascents).Count()),
            _ => query.OrderBy(g => g.Name),
        };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var since = DateTime.UtcNow.AddDays(-30);

        var dtos = items.Select(g =>
        {
            var monthlyAscents = g.Routes.SelectMany(r => r.Ascents).Count(a => a.CreatedAt >= since);
            var setterCount = _context.GymAssignments.Count(a => a.GymId == g.Id && a.RoleInGym == Domain.Entities.GymRoleInGym.Routesetter);
            var ratedRoutes = g.Routes.Where(r => r.Feedbacks.Any(f => f.Rating.HasValue)).ToList();
            var avgRating = ratedRoutes.Count > 0
                ? ratedRoutes.Average(r => r.Feedbacks.Where(f => f.Rating.HasValue).Average(f => f.Rating.Value))
                : 0;

            return new AdminGymItemDto
            {
                Id = g.Id,
                Name = g.Name,
                City = g.City ?? "",
                RouteCount = g.Routes.Count,
                SetterCount = setterCount,
                Rating = Math.Round(avgRating, 1),
                MonthlyAscents = monthlyAscents,
                Status = g.Routes.Any(r => r.IsActive) ? "Active" : g.Routes.Count == 0 ? "Pending" : "Active",
            };
        }).ToList();

        return (dtos, totalCount);
    }
}
