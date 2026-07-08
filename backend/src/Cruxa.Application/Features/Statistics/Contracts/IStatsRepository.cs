using Cruxa.Domain.Entities;
using Cruxa.Application.Features.Statistics.Contracts;

namespace Cruxa.Application.Features.Statistics.Contracts;

public interface IStatsRepository
{
    Task<UserScoreSnapshot?> GetLastSnapshotBeforeAsync(Guid userId, DateOnly date);
    Task<List<UserScoreSnapshot>> GetSnapshotsAsync(Guid userId, DateOnly from, DateOnly to);
    Task UpsertSnapshotBatchAsync(List<UserScoreSnapshot> snapshots);
    Task<List<Ascent>> GetAscentsWithRoutesAsync(Guid userId);
    Task<List<Ascent>> GetTopAscentsAsync(Guid userId, int count = 5);
    Task<List<Post>> GetPostsInRangeAsync(Guid userId, DateTimeOffset from, DateTimeOffset to);
    Task<int> GetPublishedWorkoutsCountAsync(Guid userId);
    Task<int> GetTotalAscentsCountAsync(Guid userId);
    Task<List<Ascent>> GetAscentsByDateAsync(Guid userId, DateOnly date);
    Task<List<Ascent>> GetAllAscentsOrderedAsync(Guid userId);
    Task<List<RouteReview>> GetRouteReviewsAsync(Guid routeId);
    Task<Gym?> GetGymWithRoutesAsync(Guid gymId);
    Task<Route?> GetRouteWithAscentsAndReviewsAsync(Guid routeId);
    Task<List<AscentWithRouteTags>> GetAscentsWithTagsAsync(Guid userId);
}
