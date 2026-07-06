namespace Cruxa.Domain.Enums;

/// <summary>
/// Статус поста (черновик/опубликован)
/// </summary>
public enum PostStatus
{
    /// <summary>
    /// Черновик - редактируется в процессе тренировки
    /// </summary>
    Draft = 0,

    /// <summary>
    /// Опубликован - финальная версия тренировки
    /// </summary>
    Published = 1
}
