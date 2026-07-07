using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Posts.Interfaces;

public interface IPostRepository
{
    Task<Post?> GetByIdAsync(Guid id);
    Task<(List<Post> Items, int TotalCount)> GetPagedByUserIdAsync(Guid userId, int page, int pageSize);
    Task<IEnumerable<Post>> GetByUserIdsAsync(List<Guid> userIds);
    Task<IEnumerable<Post>> GetByGymIdAsync(Guid gymId);
    Task<IEnumerable<Post>> GetAllAsync();
    Task AddAsync(Post post);
    Task UpdateAsync(Post post);
    Task DeleteAsync(Guid id);
}
