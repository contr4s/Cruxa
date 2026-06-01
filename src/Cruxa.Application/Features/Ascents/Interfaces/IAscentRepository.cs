using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Ascents.Interfaces;

public interface IAscentRepository
{
    Task<Ascent?> GetByIdAsync(Guid id);
    Task<IEnumerable<Ascent>> GetByPostIdAsync(Guid postId);
    Task<IEnumerable<Ascent>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Ascent>> GetByRouteIdAsync(Guid routeId);
    Task AddAsync(Ascent ascent);
    Task UpdateAsync(Ascent ascent);
    Task DeleteAsync(Guid id);
}
