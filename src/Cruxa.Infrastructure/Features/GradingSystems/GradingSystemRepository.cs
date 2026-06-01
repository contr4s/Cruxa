namespace Cruxa.Infrastructure.Features.GradingSystems;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistence;
using Cruxa.Application.Features.GradingSystems.Interfaces;

public class GradingSystemRepository : IGradingSystemRepository
{
    private readonly CruxaDbContext _context;

    public GradingSystemRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<GradingSystem?> GetByIdAsync(Guid id)
    {
        return await _context.GradingSystems.FindAsync(id);
    }

    public async Task<IEnumerable<GradingSystem>> GetAllAsync()
    {
        return await _context.GradingSystems.ToListAsync();
    }

    public async Task<GradingSystem?> GetByGymIdAsync(Guid gymId)
    {
        var gym = await _context.Gyms
            .Include(g => g.GradingSystem)
            .FirstOrDefaultAsync(g => g.Id == gymId);

        return gym?.GradingSystem;
    }
}
