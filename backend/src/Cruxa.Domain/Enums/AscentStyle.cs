namespace Cruxa.Domain.Enums;

/// <summary>
/// Стиль прохождения трассы
/// </summary>
public enum AscentStyle
{
    /// <summary>
    /// Онсайт - первая попытка без fell
    /// </summary>
    Onsight = 0,

    /// <summary>
    /// Флэш - первая попытка с knowledge of beta
    /// </summary>
    Flash = 1,

    /// <summary>
    /// Редпоинт - пройдено после нескольких попыток
    /// </summary>
    Redpoint = 2,

    /// <summary>
    /// Топроп - на страховке сверху
    /// </summary>
    TopRope = 3,

    /// <summary>
    /// Попытка (не оконченный пролаз)
    /// </summary>
    Attempt = 4
}
