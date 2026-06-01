namespace Cruxa.Application.Interfaces;

using Domain.Entities;

public interface IGymRepository
{
    Task<Gym?> GetByIdAsync(Guid id);
    Task<IEnumerable<Gym>> GetByCityAsync(string city);
    Task<IEnumerable<Gym>> GetAllAsync();
    Task AddAsync(Gym gym);
    Task UpdateAsync(Gym gym);
    Task DeleteAsync(Guid id);
}

public interface IRouteRepository
{
    Task<Route?> GetByIdAsync(Guid id);
    Task<IEnumerable<Route>> GetByGymIdAsync(Guid gymId);
    Task<IEnumerable<Route>> GetAllAsync();
    Task AddAsync(Route route);
    Task UpdateAsync(Route route);
    Task DeleteAsync(Guid id);
}

public interface IGradingSystemRepository
{
    Task<GradingSystem?> GetByIdAsync(Guid id);
    Task<IEnumerable<GradingSystem>> GetAllAsync();
    Task<GradingSystem?> GetByGymIdAsync(Guid gymId);
}
