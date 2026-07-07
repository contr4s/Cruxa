using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Gyms.Interfaces;

public interface IGymRepository
{
    Task<Gym?> GetByIdAsync(Guid id);
    Task<(List<Gym> Items, int TotalCount)> GetByCityPagedAsync(string city, int page, int pageSize);
    Task<(List<Gym> Items, int TotalCount)> GetAllPagedAsync(int page, int pageSize, string? city = null, Domain.Enums.GymSort? sort = null);
    Task<IEnumerable<Gym>> GetAllAsync();
    Task<List<string>> GetCitiesAsync();
    Task AddAsync(Gym gym);
    Task UpdateAsync(Gym gym);
    Task DeleteAsync(Guid id);

    /// <summary>
    /// Checks if a gym with the given name and city already exists (case-insensitive).
    /// </summary>
    Task<bool> ExistsByNameAndCityAsync(string name, string city);

    /// <summary>
    /// Adds multiple gyms in a single batch operation.
    /// </summary>
    Task AddRangeAsync(List<Gym> gyms);

    /// <summary>
    /// Removes all gyms from the database.
    /// </summary>
    Task ClearAllAsync();
}
