using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class RouteRepository : IRouteRepository
{
    private readonly CruxaDbContext _context;

    public RouteRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<Route?> GetByIdAsync(Guid id)
    {
        return await _context.Routes
            .Include(r => r.Gym)
            .Include(r => r.Author)
            .Include(r => r.Tags)
            .Include(r => r.Feedbacks)
            .Include(r => r.Ascents)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Route>> GetByGymIdAsync(Guid gymId)
    {
        return await _context.Routes
            .Include(r => r.Tags)
            .Where(r => r.GymId == gymId)
            .ToListAsync();
    }

    public async Task<(List<Route> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize)
    {
        var query = _context.Routes
            .Include(r => r.Gym)
            .Include(r => r.Author)
            .Include(r => r.Tags)
            .Include(r => r.Feedbacks)
            .Include(r => r.Ascents);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(r => r.Grade.Index)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
    }

    public async Task<(List<Route> Items, int TotalCount)> GetByGymPagedAsync(Guid gymId, int page, int pageSize)
    {
        var query = _context.Routes
            .Include(r => r.Gym)
            .Include(r => r.Author)
            .Include(r => r.Tags)
            .Include(r => r.Feedbacks)
            .Include(r => r.Ascents)
            .Where(r => r.GymId == gymId);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(r => r.Grade.Index)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
    }

    public async Task<IEnumerable<Route>> GetAllAsync()
    {
        return await _context.Routes
            .Include(r => r.Gym)
            .Include(r => r.Author)
            .Include(r => r.Tags)
            .Include(r => r.Feedbacks)
            .Include(r => r.Ascents)
            .ToListAsync();
    }

    public async Task<(List<Route> Items, int TotalCount)> GetFilteredRoutesAsync(RouteFilter filter)
    {
        var query = _context.Routes
            .Include(r => r.Gym)
            .Include(r => r.Author)
            .Include(r => r.Tags)
            .Include(r => r.Feedbacks)
            .Include(r => r.Ascents)
            .AsQueryable();

        // Author / owner
        if (filter.AuthorId.HasValue)
            query = query.Where(r => r.AuthorId == filter.AuthorId.Value);

        // Gym
        if (filter.GymId.HasValue)
            query = query.Where(r => r.GymId == filter.GymId.Value);

        // Text search by name
        if (!string.IsNullOrWhiteSpace(filter.SearchQuery))
            query = query.Where(r => r.Name.ToLower().Contains(filter.SearchQuery.ToLower()));

        // Route type
        if (filter.Type.HasValue)
            query = query.Where(r => r.Type == filter.Type.Value);

        // Hold color
        if (filter.HoldColor.HasValue)
            query = query.Where(r => r.HoldColor == filter.HoldColor.Value);

        // Grade range
        if (filter.MinGradeIndex.HasValue)
            query = query.Where(r => r.Grade.Index >= filter.MinGradeIndex.Value);
        if (filter.MaxGradeIndex.HasValue)
            query = query.Where(r => r.Grade.Index <= filter.MaxGradeIndex.Value);

        // Active / archived status
        if (!string.IsNullOrWhiteSpace(filter.Status) && filter.Status != "all")
        {
            var isActive = filter.Status == "Active";
            query = query.Where(r => r.IsActive == isActive);
        }

        // Sector
        if (!string.IsNullOrWhiteSpace(filter.Sector) && filter.Sector != "all")
            query = query.Where(r => r.Sector != null && r.Sector.ToLower() == filter.Sector.ToLower());

        // Setter
        if (filter.SetterId.HasValue)
            query = query.Where(r => r.AuthorId == filter.SetterId.Value);

        // Tags: format "category:tag1,tag2|otherCat:tag3,tag4"
        // OR inside group (comma), AND between groups (pipe)
        if (!string.IsNullOrWhiteSpace(filter.Tags))
        {
            var groups = filter.Tags.Split('|', StringSplitOptions.RemoveEmptyEntries);
            foreach (var group in groups)
            {
                var parts = group.Split(':', 2);
                if (parts.Length < 2 || string.IsNullOrWhiteSpace(parts[1])) continue;
                var tagList = parts[1].Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
                    .Select(t => t.ToLower()).ToList();
                if (tagList.Count > 0)
                {
                    var captured = tagList;
                    query = query.Where(r => r.Tags.Any(t => captured.Contains(t.Value)));
                }
            }
        }

        // Ascents count (can be done in DB)
        if (filter.MinAscents.HasValue)
            query = query.Where(r => r.Ascents.Count >= filter.MinAscents.Value);
        if (filter.MaxAscents.HasValue)
            query = query.Where(r => r.Ascents.Count <= filter.MaxAscents.Value);

        // Created within days
        if (filter.CreatedWithin.HasValue && filter.CreatedWithin.Value > 0)
        {
            var since = DateTime.UtcNow.AddDays(-filter.CreatedWithin.Value);
            query = query.Where(r => r.CreatedAt >= since);
        }

        // Apply sorting
        query = filter.Sort switch
        {
            RouteSort.Oldest => query.OrderBy(r => r.CreatedAt),
            RouteSort.RatingDesc => query.OrderByDescending(r => r.Feedbacks.Count > 0 ? r.Feedbacks.Average(f => f.Rating) ?? 0 : 0),
            RouteSort.RatingAsc => query.OrderBy(r => r.Feedbacks.Count > 0 ? r.Feedbacks.Average(f => f.Rating) ?? 0 : 0),
            RouteSort.AscentsDesc => query.OrderByDescending(r => r.Ascents.Count),
            RouteSort.AscentsAsc => query.OrderBy(r => r.Ascents.Count),
            RouteSort.GradeAsc => query.OrderBy(r => r.Grade.Index),
            RouteSort.GradeDesc => query.OrderByDescending(r => r.Grade.Index),
            RouteSort.NameAsc => query.OrderBy(r => r.Name),
            RouteSort.NameDesc => query.OrderByDescending(r => r.Name),
            _ => query.OrderByDescending(r => r.CreatedAt), // Newest
        };

        var totalCount = await query.CountAsync();

        // Apply pagination
        var items = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        // Post-filter by rating (can't be done in DB easily — computed average)
        if (filter.MinRating.HasValue || filter.MaxRating.HasValue)
        {
            items = items.Where(r =>
            {
                var rating = r.Feedbacks.Count > 0 ? r.Feedbacks.Average(f => f.Rating) ?? 0 : 0;
                if (filter.MinRating.HasValue && rating < filter.MinRating.Value) return false;
                if (filter.MaxRating.HasValue && rating > filter.MaxRating.Value) return false;
                return true;
            }).ToList();
        }

        return (items, totalCount);
    }

    public async Task AddAsync(Route route)
    {
        await _context.Routes.AddAsync(route);
    }

    public async Task UpdateAsync(Route route)
    {
        _context.Routes.Update(route);
    }

    public async Task DeleteAsync(Guid id)
    {
        var route = await GetByIdAsync(id);
        if (route != null)
        {
            _context.Routes.Remove(route);
        }
    }
}
