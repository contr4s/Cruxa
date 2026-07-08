namespace Cruxa.Application.Features.Social.Contracts;

public interface ILikeRepository
{
    Task<bool> LikePostAsync(Guid postId, Guid userId);
    Task<bool> UnlikePostAsync(Guid postId, Guid userId);
    Task<bool> IsLikedAsync(Guid postId, Guid userId);
    Task<int> GetLikesCountAsync(Guid postId);
}
