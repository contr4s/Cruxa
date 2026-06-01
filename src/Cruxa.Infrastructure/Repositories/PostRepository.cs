namespace Cruxa.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Persistence;
using Application.Interfaces;

public class PostRepository : IPostRepository
{
    private readonly CruxaDbContext _context;

    public PostRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<Post?> GetByIdAsync(Guid id)
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Gym)
            .Include(p => p.Ascents)
            .Include(p => p.Likes)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Post>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Posts
            .Include(p => p.Gym)
            .Include(p => p.Ascents)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Post>> GetByGymIdAsync(Guid gymId)
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Ascents)
            .Where(p => p.GymId == gymId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Post>> GetAllAsync()
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Gym)
            .ToListAsync();
    }

    public async Task AddAsync(Post post)
    {
        await _context.Posts.AddAsync(post);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Post post)
    {
        _context.Posts.Update(post);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var post = await GetByIdAsync(id);
        if (post != null)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }
    }
}
