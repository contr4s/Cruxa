using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Gyms.Interfaces;

public interface IGymRepository
{
    Task<Gym?> GetByIdAsync(Guid id);
    Task<(List<Gym> Items, int TotalCount)> GetByCityPagedAsync(string city, int page, int pageSize);
    Task<(List<Gym> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize);
    Task<IEnumerable<Gym>> GetAllAsync();
    Task AddAsync(Gym gym);
    Task UpdateAsync(Gym gym);
    Task DeleteAsync(Guid id);
}
