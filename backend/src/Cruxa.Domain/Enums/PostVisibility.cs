namespace Cruxa.Domain.Enums;

/// <summary>
/// Настройки видимости поста
/// </summary>
public enum PostVisibility
{
    /// <summary>
    /// Публичный пост, виден всем
    /// </summary>
    Public = 0,

    /// <summary>
    /// Только подписчикам
    /// </summary>
    Followers = 1,

    /// <summary>
    /// Только себе (приватные заметки)
    /// </summary>
    Private = 2
}
