using Cruxa.Application.Features.Ascents.DTOs;

namespace Cruxa.Application.Features.Posts.DTOs;

using Domain.Enums;

/// <summary>
/// DTO для поста-тренировки
/// </summary>
public class PostDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? UserAvatarUrl { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public Guid GymId { get; set; }
    public string GymName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Body => Description;
    public List<string> MediaUrls { get; set; } = [];
    public PostVisibility Visibility { get; set; }
    public PostStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public int? Duration { get; set; }
    public bool IsLiked { get; set; }
    public PostStatsDto? Stats { get; set; }
    public List<AscentDto> Ascents { get; set; } = [];
}
