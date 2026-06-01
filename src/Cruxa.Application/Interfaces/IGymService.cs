namespace Cruxa.Application.Interfaces;

using DTOs;

public interface IGymService
{
    Task<GymDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<GymDto>> GetByCityAsync(string city);
    Task<IEnumerable<GymDto>> GetAllAsync();
    Task<GymDto> CreateAsync(CreateGymRequest request);
    Task<GymDto?> UpdateAsync(Guid id, CreateGymRequest request);
    Task<bool> DeleteAsync(Guid id);
}
