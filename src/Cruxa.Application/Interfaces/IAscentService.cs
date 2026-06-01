namespace Cruxa.Application.Interfaces;

using DTOs;

public interface IAscentService
{
    Task<AscentDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<AscentDto>> GetByRouteAsync(Guid routeId);
    Task<IEnumerable<AscentDto>> GetByUserAsync(Guid userId);
    Task<IEnumerable<AscentDto>> GetByPostAsync(Guid postId);
    Task<AscentDto> CreateAsync(CreateAscentRequest request, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
