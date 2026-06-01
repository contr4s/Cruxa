namespace Cruxa.Application.DTOs;

/// <summary>
/// Запрос на регистрацию пользователя
/// </summary>
public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? City { get; set; }
}

/// <summary>
/// Запрос на вход в систему
/// </summary>
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Ответ с JWT токеном
/// </summary>
public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}
