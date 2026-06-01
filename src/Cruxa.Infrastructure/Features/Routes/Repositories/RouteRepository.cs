namespace Cruxa.Infrastructure.Features.Routes.Repositories;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistence;
using Cruxa.Application.Features.Routes.Interfaces;

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
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Route>> GetByGymIdAsync(Guid gymId)
    {
        return await _context.Routes
            .Where(r => r.GymId == gymId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Route>> GetAllAsync()
    {
        return await _context.Routes
            .Include(r => r.Gym)
            .ToListAsync();
    }

    public async Task AddAsync(Route route)
    {
        await _context.Routes.AddAsync(route);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Route route)
    {
        _context.Routes.Update(route);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var route = await GetByIdAsync(id);
        if (route != null)
        {
            _context.Routes.Remove(route);
            await _context.SaveChangesAsync();
        }
    }
}
