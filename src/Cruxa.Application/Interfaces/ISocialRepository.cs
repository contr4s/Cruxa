namespace Cruxa.Application.Interfaces;

using Domain.Entities;

public interface IPostRepository
{
    Task<Post?> GetByIdAsync(Guid id);
    Task<IEnumerable<Post>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Post>> GetByGymIdAsync(Guid gymId);
    Task<IEnumerable<Post>> GetAllAsync();
    Task AddAsync(Post post);
    Task UpdateAsync(Post post);
    Task DeleteAsync(Guid id);
}

public interface IAscentRepository
{
    Task<Ascent?> GetByIdAsync(Guid id);
    Task<IEnumerable<Ascent>> GetByPostIdAsync(Guid postId);
    Task<IEnumerable<Ascent>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Ascent>> GetByRouteIdAsync(Guid routeId);
    Task AddAsync(Ascent ascent);
    Task UpdateAsync(Ascent ascent);
    Task DeleteAsync(Guid id);
}

public interface ILikeRepository
{
    Task<bool> LikePostAsync(Guid postId, Guid userId);
    Task<bool> UnlikePostAsync(Guid postId, Guid userId);
    Task<bool> IsLikedAsync(Guid postId, Guid userId);
    Task<int> GetLikesCountAsync(Guid postId);
}

public interface ICommentRepository
{
    Task<Comment?> GetByIdAsync(Guid id);
    Task<IEnumerable<Comment>> GetByPostIdAsync(Guid postId);
    Task<IEnumerable<Comment>> GetRecentByPostIdAsync(Guid postId, int limit);
    Task AddAsync(Comment comment);
    Task UpdateAsync(Comment comment);
    Task DeleteAsync(Guid id);
}

public interface IFollowerRepository
{
    Task<bool> FollowAsync(Guid followerId, Guid followeeId);
    Task<bool> UnfollowAsync(Guid followerId, Guid followeeId);
    Task<bool> IsFollowingAsync(Guid followerId, Guid followeeId);
    Task<IEnumerable<Guid>> GetFollowersAsync(Guid userId);
    Task<IEnumerable<Guid>> GetFollowingAsync(Guid userId);
}
