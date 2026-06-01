namespace Cruxa.Application.Interfaces;

using DTOs;

public interface IUserService
{
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto?> GetByUsernameAsync(string username);
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto> UpdateAsync(Guid id, UpdateUserRequest request);
    Task DeleteAsync(Guid id);
}

public class UpdateUserRequest
{
    public string? City { get; set; }
    public string? AvatarUrl { get; set; }
}
