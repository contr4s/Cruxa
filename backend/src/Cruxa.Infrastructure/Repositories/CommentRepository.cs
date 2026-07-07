using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly CruxaDbContext _context;

    public CommentRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<Comment?> GetByIdAsync(Guid id)
    {
        return await _context.Comments
            .Include(c => c.User)
            .Include(c => c.Post)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Comment>> GetByPostIdAsync(Guid postId)
    {
        return await _context.Comments
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<(List<Comment> Items, int TotalCount)> GetPagedByPostIdAsync(Guid postId, int page, int pageSize)
    {
        var query = _context.Comments
            .Include(c => c.User)
            .Where(c => c.PostId == postId);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (items, totalCount);
    }

    public async Task<IEnumerable<Comment>> GetRecentByPostIdAsync(Guid postId, int limit)
    {
        return await _context.Comments
            .Include(c => c.User)
            .Where(c => c.PostId == postId)
            .OrderByDescending(c => c.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task AddAsync(Comment comment)
    {
        await _context.Comments.AddAsync(comment);
    }

    public async Task UpdateAsync(Comment comment)
    {
        _context.Comments.Update(comment);
    }

    public async Task DeleteAsync(Guid id)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment != null)
        {
            _context.Comments.Remove(comment);
        }
    }
}
