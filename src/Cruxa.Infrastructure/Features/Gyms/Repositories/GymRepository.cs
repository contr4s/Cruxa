namespace Cruxa.Infrastructure.Features.Gyms.Repositories;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistence;
using Cruxa.Application.Features.Gyms.Interfaces;

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
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Gym gym)
    {
        _context.Gyms.Update(gym);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var gym = await GetByIdAsync(id);
        if (gym != null)
        {
            _context.Gyms.Remove(gym);
            await _context.SaveChangesAsync();
        }
    }
}
