using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

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

        var follower = Follower.Create(followerId, followeeId).Value!;
        await _context.Followers.AddAsync(follower);
        return true;
    }

    public async Task<bool> UnfollowAsync(Guid followerId, Guid followeeId)
    {
        var follower = await _context.Followers
            .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);

        if (follower == null)
            return false;

        _context.Followers.Remove(follower);
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
