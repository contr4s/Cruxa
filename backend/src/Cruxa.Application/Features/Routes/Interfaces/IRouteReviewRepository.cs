using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Interfaces;

public interface IRouteReviewRepository
{
    Task<RouteReview?> GetByIdAsync(Guid id);
    Task<RouteReview?> GetByRouteAndUserAsync(Guid routeId, Guid userId);
    Task<IEnumerable<RouteReview>> GetByRouteIdAsync(Guid routeId);
    Task<IEnumerable<RouteReview>> GetByUserIdAsync(Guid userId);
    Task AddAsync(RouteReview review);
    Task UpdateAsync(RouteReview review);
    Task DeleteAsync(Guid id);
}
