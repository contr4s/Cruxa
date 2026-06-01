namespace Cruxa.Application.Interfaces;

using DTOs;

public interface IRouteService
{
    Task<RouteDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<RouteDto>> GetByGymAsync(Guid gymId);
    Task<IEnumerable<RouteDto>> GetAllAsync();
    Task<RouteDto> CreateAsync(CreateRouteRequest request, Guid? authorId = null);
    Task<bool> UpdateAsync(Guid id, UpdateRouteRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<int> CalculateGradeIndexAsync(string gradeRaw, Guid gymId);
}
