using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Contracts;

public interface IRouteFeedbackRepository
{
    Task<RouteFeedback?> GetByIdAsync(Guid id);
    Task<RouteFeedback?> GetByRouteAndUserAsync(Guid routeId, Guid userId);
    Task<(List<RouteFeedback> Items, int TotalCount)> GetPagedByRouteIdAsync(Guid routeId, int page, int pageSize);
    Task<IEnumerable<RouteFeedback>> GetByUserIdAsync(Guid userId);
    Task<List<(int GradeIndex, int Count)>> GetGradeDistributionAsync(Guid routeId);
    Task<int?> GetUserGradeVoteAsync(Guid routeId, Guid userId);
    Task AddAsync(RouteFeedback feedback);
    Task UpdateAsync(RouteFeedback feedback);
    Task DeleteAsync(Guid id);
}
