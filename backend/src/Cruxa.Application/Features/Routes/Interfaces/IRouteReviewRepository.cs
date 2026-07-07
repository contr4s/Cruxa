using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Interfaces;

public interface IRouteReviewRepository
{
    Task<RouteReview?> GetByIdAsync(Guid id);
    Task<RouteReview?> GetByRouteAndUserAsync(Guid routeId, Guid userId);
    Task<(List<RouteReview> Items, int TotalCount)> GetPagedByRouteIdAsync(Guid routeId, int page, int pageSize);
    Task<IEnumerable<RouteReview>> GetByUserIdAsync(Guid userId);
    Task AddAsync(RouteReview review);
    Task UpdateAsync(RouteReview review);
    Task DeleteAsync(Guid id);
}
