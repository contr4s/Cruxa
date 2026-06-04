using Cruxa.Application.Features.Routes.Interfaces;
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
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Route>> GetByGymIdAsync(Guid gymId)
    {
        return await _context.Routes
            .Include(r => r.Tags)
            .Where(r => r.GymId == gymId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Route>> GetAllAsync()
    {
        return await _context.Routes
            .Include(r => r.Gym)
            .Include(r => r.Tags)
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
