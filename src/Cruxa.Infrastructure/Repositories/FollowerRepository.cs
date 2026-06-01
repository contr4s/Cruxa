namespace Cruxa.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistence;
using Application.Interfaces;

public class FollowerRepository : IFollowerRepository
{
    private readonly CruxaDbContext _context;

    public FollowerRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<bool> FollowAsync(Guid followerId, Guid followeeId)
    {
        if (await IsFollowingAsync(followerId, followeeId))
            return false;

        var follower = new Follower
        {
            FollowerId = followerId,
            FolloweeId = followeeId,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Followers.AddAsync(follower);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnfollowAsync(Guid followerId, Guid followeeId)
    {
        var follower = await _context.Followers
            .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);

        if (follower == null)
            return false;

        _context.Followers.Remove(follower);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsFollowingAsync(Guid followerId, Guid followeeId)
    {
        return await _context.Followers
            .AnyAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);
    }

    public async Task<IEnumerable<Guid>> GetFollowersAsync(Guid userId)
    {
        return await _context.Followers
            .Where(f => f.FolloweeId == userId)
            .Select(f => f.FollowerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Guid>> GetFollowingAsync(Guid userId)
    {
        return await _context.Followers
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FolloweeId)
            .ToListAsync();
    }
}
