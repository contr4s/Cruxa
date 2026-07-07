using Cruxa.Application.Features.Gyms.Interfaces;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class GymRepository : IGymRepository
{
    private readonly CruxaDbContext _context;

    public GymRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<Gym?> GetByIdAsync(Guid id)
    {
        return await _context.Gyms
            .Include(g => g.GradingSystem)
            .Include(g => g.Routes)
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<IEnumerable<Gym>> GetByCityAsync(string city)
    {
        return await _context.Gyms
            .Include(g => g.Routes)
            .Where(g => g.City == city)
            .ToListAsync();
    }

    public async Task<(List<Gym> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize, string? city = null, Domain.Enums.GymSort? sort = null)
    {
        IQueryable<Gym> query = _context.Gyms
            .Include(g => g.GradingSystem)
            .Include(g => g.Routes);

        if (!string.IsNullOrEmpty(city) && city != "all")
            query = query.Where(g => g.City == city);

        var totalCount = await query.CountAsync();

        IOrderedQueryable<Gym> ordered = sort switch
        {
            Domain.Enums.GymSort.Name => query.OrderBy(g => g.Name),
            Domain.Enums.GymSort.Rating => query.OrderByDescending(g => g.Routes.Average(r => r.Reviews.Average(rv => (double?)rv.Rating) ?? 0)),
            Domain.Enums.GymSort.Routes => query.OrderByDescending(g => g.Routes.Count),
            _ => query.OrderBy(g => g.Name)
        };

        var items = await ordered
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
    }

    public async Task<List<string>> GetCitiesAsync()
    {
        return await _context.Gyms
            .Select(g => g.City)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
    }

    public async Task<(List<Gym> Items, int TotalCount)> GetByCityPagedAsync(string city, int page, int pageSize)
    {
        var query = _context.Gyms
            .Include(g => g.Routes)
            .Where(g => g.City == city);
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(g => g.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
    }

    public async Task<IEnumerable<Gym>> GetAllAsync()
    {
        return await _context.Gyms
            .Include(g => g.GradingSystem)
            .Include(g => g.Routes)
            .ToListAsync();
    }

    public async Task AddAsync(Gym gym)
    {
        await _context.Gyms.AddAsync(gym);
    }

    public async Task UpdateAsync(Gym gym)
    {
        _context.Gyms.Update(gym);
    }

    public async Task DeleteAsync(Guid id)
    {
        var gym = await GetByIdAsync(id);
        if (gym is not null)
        {
            _context.Gyms.Remove(gym);
        }
    }

    public async Task<bool> ExistsByNameAndCityAsync(string name, string city)
    {
        return await _context.Gyms
            .AnyAsync(g => g.Name.ToLower() == name.ToLower()
                        && g.City.ToLower() == city.ToLower());
    }

    public async Task AddRangeAsync(List<Gym> gyms)
    {
        await _context.Gyms.AddRangeAsync(gyms);
    }

    public async Task ClearAllAsync()
    {
        _context.Gyms.RemoveRange(await _context.Gyms.ToListAsync());
    }
}
