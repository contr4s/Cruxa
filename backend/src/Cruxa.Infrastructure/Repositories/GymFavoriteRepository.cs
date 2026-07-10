using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class GymFavoriteRepository : IGymFavoriteRepository
{
    private readonly CruxaDbContext _context;

    public GymFavoriteRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<bool> AddAsync(Guid userId, Guid gymId)
    {
        if (await IsFavoriteAsync(userId, gymId))
            return false;

        var favorite = UserFavoriteGym.Create(userId, gymId).Value!;
        await _context.Set<UserFavoriteGym>().AddAsync(favorite);
        return true;
    }

    public async Task<bool> RemoveAsync(Guid userId, Guid gymId)
    {
        var favorite = await _context.Set<UserFavoriteGym>()
            .FirstOrDefaultAsync(f => f.UserId == userId && f.GymId == gymId);

        if (favorite == null)
            return false;

        _context.Set<UserFavoriteGym>().Remove(favorite);
        return true;
    }

    public async Task<bool> IsFavoriteAsync(Guid userId, Guid gymId)
    {
        return await _context.Set<UserFavoriteGym>()
            .AnyAsync(f => f.UserId == userId && f.GymId == gymId);
    }

    public async Task<List<Guid>> GetFavoriteGymIdsAsync(Guid userId)
    {
        return await _context.Set<UserFavoriteGym>()
            .Where(f => f.UserId == userId)
            .Select(f => f.GymId)
            .ToListAsync();
    }
}
