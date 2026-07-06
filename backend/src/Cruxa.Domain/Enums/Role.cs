namespace Cruxa.Domain.Enums;

/// <summary>
/// Роли пользователей в системе
/// </summary>
public enum Role
{
    /// <summary>
    /// Основной пользователь - скалолаз
    /// </summary>
    Climber = 0,

    /// <summary>
    /// Рутсеттер - устанавливает трассы в скалодромах
    /// </summary>
    Routesetter = 1,

    /// <summary>
    /// Администратор скалодрома - управляет профилем зала
    /// </summary>
    GymAdmin = 2,

    /// <summary>
    /// Супер-администратор системы
    /// </summary>
    Admin = 3
}
