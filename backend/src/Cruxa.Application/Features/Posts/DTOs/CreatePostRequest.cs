using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Posts.DTOs;

/// <summary>
/// Запрос на создание поста
/// </summary>
public class CreatePostRequest
{
    public Guid GymId { get; set; }
    public string? Description { get; set; }
    public List<string>? MediaUrls { get; set; }
    public PostVisibility Visibility { get; set; } = PostVisibility.Public;
    public int? Duration { get; set; }
    public PostStatus? Status { get; set; }
}
