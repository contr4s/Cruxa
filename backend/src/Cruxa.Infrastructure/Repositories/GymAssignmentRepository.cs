using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class GymAssignmentRepository : IGymAssignmentRepository
{
    private readonly CruxaDbContext _context;

    public GymAssignmentRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<List<GymAssignment>> GetByUserIdAsync(Guid userId)
    {
        return await _context.GymAssignments
            .Include(x => x.Gym)
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task<List<GymAssignment>> GetByGymIdAsync(Guid gymId)
    {
        return await _context.GymAssignments
            .Include(x => x.User)
            .Where(x => x.GymId == gymId)
            .ToListAsync();
    }

    public async Task AddAsync(GymAssignment assignment)
    {
        await _context.GymAssignments.AddAsync(assignment);
    }

    public async Task AddRangeAsync(List<GymAssignment> assignments)
    {
        await _context.GymAssignments.AddRangeAsync(assignments);
    }

    public async Task DeleteRangeAsync(IEnumerable<GymAssignment> assignments)
    {
        _context.GymAssignments.RemoveRange(assignments);
    }

    public async Task<List<GymAssignment>> GetAllAsync()
    {
        return await _context.GymAssignments
            .Include(x => x.Gym)
            .Include(x => x.User)
            .ToListAsync();
    }
}
