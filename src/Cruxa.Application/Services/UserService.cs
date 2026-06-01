namespace Cruxa.Application.Services;

using AutoMapper;
using Interfaces;
using DTOs;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> GetByUsernameAsync(string username)
    {
        var user = await _userRepository.GetByUsernameAsync(username);
        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto> UpdateAsync(Guid id, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new InvalidOperationException($"User {id} not found");

        if (!string.IsNullOrEmpty(request.City))
            user.City = request.City;
        if (!string.IsNullOrEmpty(request.AvatarUrl))
            user.AvatarUrl = request.AvatarUrl;

        await _userRepository.UpdateAsync(user);
        return _mapper.Map<UserDto>(user);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _userRepository.DeleteAsync(id);
    }
}
