namespace Cruxa.Tests.Unit.Application;

using AutoMapper;
using Cruxa.Application.DTOs;
using Cruxa.Application.Interfaces;
using Cruxa.Application.Services;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using FluentAssertions;
using Moq;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _mapperMock = new Mock<IMapper>();
        _userService = new UserService(_userRepositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserExists_ReturnsUserDto()
    {
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Username = "testuser",
            Email = "test@test.com",
            Role = Role.Climber,
            CreatedAt = DateTime.UtcNow
        };
        var userDto = new UserDto
        {
            Id = userId,
            Username = "testuser",
            Email = "test@test.com",
            Role = "Climber",
            CreatedAt = user.CreatedAt
        };

        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync(user);
        _mapperMock.Setup(m => m.Map<UserDto>(user))
            .Returns(userDto);

        var result = await _userService.GetByIdAsync(userId);

        result.Should().NotBeNull();
        result!.Username.Should().Be("testuser");
        result.Email.Should().Be("test@test.com");
        result.Role.Should().Be("Climber");
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserDoesNotExist_ReturnsNull()
    {
        var userId = Guid.NewGuid();
        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId))
            .ReturnsAsync((User?)null);

        var result = await _userService.GetByIdAsync(userId);

        result.Should().BeNull();
    }
}
