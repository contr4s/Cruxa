using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Posts.Interfaces;

public interface IPostRepository
{
    Task<Post?> GetByIdAsync(Guid id);
    Task<IEnumerable<Post>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Post>> GetByUserIdsAsync(List<Guid> userIds);
    Task<IEnumerable<Post>> GetByGymIdAsync(Guid gymId);
    Task<IEnumerable<Post>> GetAllAsync();
    Task AddAsync(Post post);
    Task UpdateAsync(Post post);
    Task DeleteAsync(Guid id);
}
