namespace Cruxa.Tests.Unit.Application;

using Cruxa.Application.Features.Users.Queries;
using Cruxa.Application.Features.Users.Handlers;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;
using FluentAssertions;
using Moq;

public class UserHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock = new();
    private readonly GetUserByIdHandler _handler;

    public UserHandlerTests()
    {
        _handler = new GetUserByIdHandler(_userRepositoryMock.Object);
    }

    [Fact]
    public async Task GetById_WhenUserExists_ReturnsUserDto()
    {
        var userId = Guid.NewGuid();
        var email = Email.Create("test@test.com").Value!;
        var userResult = User.Create(email, "testuser", "hash");
        var user = userResult.Value!;

        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        var result = await _handler.Handle(new GetUserByIdQuery(userId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Username.Should().Be("testuser");
    }

    [Fact]
    public async Task GetById_WhenUserDoesNotExist_ReturnsFailure()
    {
        var userId = Guid.NewGuid();
        _userRepositoryMock.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((User?)null);

        var result = await _handler.Handle(new GetUserByIdQuery(userId), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
    }
}
