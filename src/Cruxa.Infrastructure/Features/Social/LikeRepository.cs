namespace Cruxa.Infrastructure.Features.Social;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistence;
using Cruxa.Application.Features.Social.Interfaces;

public class LikeRepository : ILikeRepository
{
    private readonly CruxaDbContext _context;

    public LikeRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<bool> LikePostAsync(Guid postId, Guid userId)
    {
        if (await IsLikedAsync(postId, userId))
            return false;

        var like = new Like
        {
            Id = Guid.NewGuid(),
            PostId = postId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Likes.AddAsync(like);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UnlikePostAsync(Guid postId, Guid userId)
    {
        var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

        if (like == null)
            return false;

        _context.Likes.Remove(like);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsLikedAsync(Guid postId, Guid userId)
    {
        return await _context.Likes
            .AnyAsync(l => l.PostId == postId && l.UserId == userId);
    }

    public async Task<int> GetLikesCountAsync(Guid postId)
    {
        return await _context.Likes
            .CountAsync(l => l.PostId == postId);
    }
}
