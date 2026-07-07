namespace Cruxa.Domain.Enums;

/// <summary>
/// Фильтр ленты постов
/// </summary>
public enum FeedFilter
{
    /// <summary>Только посты от пользователей, на кого подписан</summary>
    Subs = 0,
    /// <summary>Рекомендованные посты (по умолчанию)</summary>
    Recommended = 1
}
