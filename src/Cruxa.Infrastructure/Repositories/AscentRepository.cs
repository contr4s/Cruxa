namespace Cruxa.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistence;
using Application.Interfaces;

public class AscentRepository : IAscentRepository
{
    private readonly CruxaDbContext _context;

    public AscentRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<Ascent?> GetByIdAsync(Guid id)
    {
        return await _context.Ascents
            .Include(a => a.Route)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Ascent>> GetByPostIdAsync(Guid postId)
    {
        return await _context.Ascents
            .Include(a => a.Route)
            .Where(a => a.PostId == postId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ascent>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Ascents
            .Include(a => a.Route)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Ascent>> GetByRouteIdAsync(Guid routeId)
    {
        return await _context.Ascents
            .Where(a => a.RouteId == routeId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Ascent ascent)
    {
        await _context.Ascents.AddAsync(ascent);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Ascent ascent)
    {
        _context.Ascents.Update(ascent);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var ascent = await GetByIdAsync(id);
        if (ascent != null)
        {
            _context.Ascents.Remove(ascent);
            await _context.SaveChangesAsync();
        }
    }
}
