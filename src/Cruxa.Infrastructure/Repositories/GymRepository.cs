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
            .FirstOrDefaultAsync(g => g.Id == id);
    }

    public async Task<IEnumerable<Gym>> GetByCityAsync(string city)
    {
        return await _context.Gyms
            .Where(g => g.City == city)
            .ToListAsync();
    }

    public async Task<IEnumerable<Gym>> GetAllAsync()
    {
        return await _context.Gyms
            .Include(g => g.GradingSystem)
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
        if (gym != null)
        {
            _context.Gyms.Remove(gym);
        }
    }
}
