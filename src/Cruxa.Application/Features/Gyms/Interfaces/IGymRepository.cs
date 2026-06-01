using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Gyms.Interfaces;

public interface IGymRepository
{
    Task<Gym?> GetByIdAsync(Guid id);
    Task<IEnumerable<Gym>> GetByCityAsync(string city);
    Task<IEnumerable<Gym>> GetAllAsync();
    Task AddAsync(Gym gym);
    Task UpdateAsync(Gym gym);
    Task DeleteAsync(Guid id);
}
