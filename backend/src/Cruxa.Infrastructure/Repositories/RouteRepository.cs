using Cruxa.Application.Features.Routes.Contracts;
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
