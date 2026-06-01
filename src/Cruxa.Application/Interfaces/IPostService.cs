namespace Cruxa.Application.Interfaces;

using DTOs;
using Domain.Enums;

public interface IPostService
{
    Task<PostDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<PostDto>> GetByUserAsync(Guid userId);
    Task<IEnumerable<PostDto>> GetByGymAsync(Guid gymId, PostVisibility? visibility = null);
    Task<IEnumerable<PostDto>> GetFeedAsync(IEnumerable<Guid> followedUserIds);
    Task<PostDto> CreateAsync(CreatePostRequest request, Guid userId);
    Task<PostDto?> UpdateAsync(Guid id, Guid userId, UpdatePostRequest request);
    Task<bool> DeleteAsync(Guid id, Guid userId);
    Task<PostDto?> PublishAsync(Guid postId, Guid userId);
}

public class UpdatePostRequest
{
    public string? Description { get; set; }
    public List<string>? MediaUrls { get; set; }
    public PostVisibility? Visibility { get; set; }
}
