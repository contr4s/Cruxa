namespace Cruxa.Application.Features.Auth.DTOs;

using Cruxa.Application.Features.Users.DTOs;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}
