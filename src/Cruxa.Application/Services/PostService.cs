namespace Cruxa.Application.Services;

using AutoMapper;
using DTOs;
using Interfaces;
using Domain.Entities;
using Domain.Enums;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;
    private readonly IUserRepository _userRepository;
    private readonly IGymRepository _gymRepository;
    private readonly IMapper _mapper;

    public PostService(
        IPostRepository postRepository,
        IUserRepository userRepository,
        IGymRepository gymRepository,
        IMapper mapper)
    {
        _postRepository = postRepository;
        _userRepository = userRepository;
        _gymRepository = gymRepository;
        _mapper = mapper;
    }

    public async Task<PostDto?> GetByIdAsync(Guid id)
    {
        var post = await _postRepository.GetByIdAsync(id);
        return post == null ? null : _mapper.Map<PostDto>(post);
    }

    public async Task<IEnumerable<PostDto>> GetByUserAsync(Guid userId)
    {
        var posts = await _postRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<PostDto>>(posts);
    }

    public async Task<IEnumerable<PostDto>> GetByGymAsync(Guid gymId, PostVisibility? visibility = null)
    {
        var posts = await _postRepository.GetByGymIdAsync(gymId);
        return _mapper.Map<IEnumerable<PostDto>>(posts);
    }

    public async Task<IEnumerable<PostDto>> GetFeedAsync(IEnumerable<Guid> followedUserIds)
    {
        var userIds = followedUserIds.ToList();
        var allPosts = new List<Post>();

        foreach (var userId in userIds)
        {
            var posts = await _postRepository.GetByUserIdAsync(userId);
            allPosts.AddRange(posts.Where(p => p.Status == PostStatus.Published));
        }

        allPosts = allPosts.OrderByDescending(p => p.CreatedAt).ToList();
        return _mapper.Map<IEnumerable<PostDto>>(allPosts);
    }

    public async Task<PostDto> CreateAsync(CreatePostRequest request, Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new InvalidOperationException($"User {userId} not found");
        var gym = await _gymRepository.GetByIdAsync(request.GymId)
            ?? throw new InvalidOperationException($"Gym {request.GymId} not found");

        var post = new Post
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GymId = request.GymId,
            Description = request.Description,
            MediaUrls = request.MediaUrls ?? [],
            Visibility = request.Visibility,
            Status = PostStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };

        await _postRepository.AddAsync(post);
        return _mapper.Map<PostDto>(post);
    }

    public async Task<PostDto?> UpdateAsync(Guid id, Guid userId, UpdatePostRequest request)
    {
        var post = await _postRepository.GetByIdAsync(id);
        if (post == null || post.UserId != userId)
            return null;

        if (request.Description != null)
            post.Description = request.Description;
        if (request.MediaUrls != null)
            post.MediaUrls = request.MediaUrls;
        if (request.Visibility.HasValue)
            post.Visibility = request.Visibility.Value;

        await _postRepository.UpdateAsync(post);
        return _mapper.Map<PostDto>(post);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var post = await _postRepository.GetByIdAsync(id);
        if (post == null || post.UserId != userId)
            return false;

        await _postRepository.DeleteAsync(id);
        return true;
    }

    public async Task<PostDto?> PublishAsync(Guid postId, Guid userId)
    {
        var post = await _postRepository.GetByIdAsync(postId);
        if (post == null || post.UserId != userId)
            return null;

        post.Status = PostStatus.Published;
        await _postRepository.UpdateAsync(post);
        return _mapper.Map<PostDto>(post);
    }
}
