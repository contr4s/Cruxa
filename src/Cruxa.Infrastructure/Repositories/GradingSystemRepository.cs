using Cruxa.Application.Features.GradingSystems.Interfaces;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

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
