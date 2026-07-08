using Cruxa.Application.Features.Ascents.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

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

    public async Task<(List<Ascent> Items, int TotalCount)> GetByPostPagedAsync(Guid postId, int page, int pageSize)
    {
        var query = _context.Ascents
            .Include(a => a.Route)
            .Where(a => a.PostId == postId);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
    }

    public async Task<(List<Ascent> Items, int TotalCount)> GetByUserPagedAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.Ascents
            .Include(a => a.Route)
            .Where(a => a.UserId == userId);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
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
    }

    public async Task UpdateAsync(Ascent ascent)
    {
        _context.Ascents.Update(ascent);
    }

    public async Task DeleteAsync(Guid id)
    {
        var ascent = await GetByIdAsync(id);
        if (ascent != null)
        {
            _context.Ascents.Remove(ascent);
        }
    }
}
