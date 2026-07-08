using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Ascents.Contracts;

public interface IAscentRepository
{
    Task<Ascent?> GetByIdAsync(Guid id);
    Task<(List<Ascent> Items, int TotalCount)> GetByPostPagedAsync(Guid postId, int page, int pageSize);
    Task<(List<Ascent> Items, int TotalCount)> GetByUserPagedAsync(Guid userId, int page, int pageSize);
    Task<IEnumerable<Ascent>> GetByPostIdAsync(Guid postId);
    Task<IEnumerable<Ascent>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Ascent>> GetByRouteIdAsync(Guid routeId);
    Task AddAsync(Ascent ascent);
    Task UpdateAsync(Ascent ascent);
    Task DeleteAsync(Guid id);
}
