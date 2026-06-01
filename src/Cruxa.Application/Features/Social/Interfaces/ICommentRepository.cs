using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Social.Interfaces;

public interface ICommentRepository
{
    Task<Comment?> GetByIdAsync(Guid id);
    Task<IEnumerable<Comment>> GetByPostIdAsync(Guid postId);
    Task<IEnumerable<Comment>> GetRecentByPostIdAsync(Guid postId, int limit);
    Task AddAsync(Comment comment);
    Task UpdateAsync(Comment comment);
    Task DeleteAsync(Guid id);
}
