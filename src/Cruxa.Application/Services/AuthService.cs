namespace Cruxa.Application.Services;

using System.Security.Cryptography;
using AutoMapper;
using DTOs;
using Interfaces;
using Domain.Entities;
using Domain.Enums;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _mapper = mapper;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _userRepository.ExistsByEmailAsync(request.Email))
            throw new InvalidOperationException("Email already registered");

        if (await _userRepository.ExistsByUsernameAsync(request.Username))
            throw new InvalidOperationException("Username already taken");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            City = request.City,
            Role = Role.Climber,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        var token = await _jwtTokenGenerator.GenerateTokenAsync(user);
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponse { Token = token, User = userDto };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            return null;

        var token = await _jwtTokenGenerator.GenerateTokenAsync(user);
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponse { Token = token, User = userDto };
    }

    private static string HashPassword(string password)
    {
        using var rng = RandomNumberGenerator.Create();
        var salt = new byte[16];
        rng.GetBytes(salt);

        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);

        var hashBytes = new byte[48];
        Array.Copy(salt, 0, hashBytes, 0, 16);
        Array.Copy(hash, 0, hashBytes, 16, 32);

        return Convert.ToBase64String(hashBytes);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        var hashBytes = Convert.FromBase64String(storedHash);

        var salt = new byte[16];
        Array.Copy(hashBytes, 0, salt, 0, 16);

        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 100000, HashAlgorithmName.SHA256, 32);

        for (int i = 0; i < 32; i++)
        {
            if (hashBytes[i + 16] != hash[i])
                return false;
        }

        return true;
    }
}
