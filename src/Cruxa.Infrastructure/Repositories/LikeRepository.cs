using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

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

        var like = Like.Create(postId, userId).Value!;
        await _context.Likes.AddAsync(like);
        return true;
    }

    public async Task<bool> UnlikePostAsync(Guid postId, Guid userId)
    {
        var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

        if (like == null)
            return false;

        _context.Likes.Remove(like);
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
