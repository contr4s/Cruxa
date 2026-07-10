namespace Cruxa.Application.Features.Gyms.Contracts;

public interface IGymFavoriteRepository
{
    Task<bool> AddAsync(Guid userId, Guid gymId);
    Task<bool> RemoveAsync(Guid userId, Guid gymId);
    Task<bool> IsFavoriteAsync(Guid userId, Guid gymId);
    Task<List<Guid>> GetFavoriteGymIdsAsync(Guid userId);
}
