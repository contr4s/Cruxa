using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Social.Contracts;

public interface ICommentRepository
{
    Task<Comment?> GetByIdAsync(Guid id);
    Task<(List<Comment> Items, int TotalCount)> GetPagedByPostIdAsync(Guid postId, int page, int pageSize);
    Task<IEnumerable<Comment>> GetRecentByPostIdAsync(Guid postId, int limit);
    Task AddAsync(Comment comment);
    Task UpdateAsync(Comment comment);
    Task DeleteAsync(Guid id);
}
