namespace Cruxa.Application.Features.Social.Interfaces;

public interface IFollowerRepository
{
    Task<bool> FollowAsync(Guid followerId, Guid followeeId);
    Task<bool> UnfollowAsync(Guid followerId, Guid followeeId);
    Task<bool> IsFollowingAsync(Guid followerId, Guid followeeId);
    Task<IEnumerable<Guid>> GetFollowersAsync(Guid userId);
    Task<IEnumerable<Guid>> GetFollowingAsync(Guid userId);
}
