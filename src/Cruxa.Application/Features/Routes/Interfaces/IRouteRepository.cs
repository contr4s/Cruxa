using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Interfaces;

public interface IRouteRepository
{
    Task<Route?> GetByIdAsync(Guid id);
    Task<IEnumerable<Route>> GetByGymIdAsync(Guid gymId);
    Task<IEnumerable<Route>> GetAllAsync();
    Task AddAsync(Route route);
    Task UpdateAsync(Route route);
    Task DeleteAsync(Guid id);
}
