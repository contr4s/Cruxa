using Cruxa.Application.Features.Users.Handlers;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Application.Features.Users.Queries;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;
using FluentAssertions;
using Cruxa.Application.Common.Contracts;
using Moq;

namespace Cruxa.Tests.Unit.Application.Users;

public class UserHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IUserRepository> _userRepo = new();

    private User CreateUser()
    {
        var email = Email.Create(_fixture.Faker.Internet.Email()).Value!;
        var result = User.Create(email, _fixture.Faker.Internet.UserName(), _fixture.Faker.Lorem.Word());
        return result.Value!;
    }

    [Fact]
    public async Task GetById_WhenUserExists_ReturnsUserDto()
    {
        var userId = Guid.NewGuid();
        var user = CreateUser();
        var handler = new GetUserByIdHandler(_userRepo.Object);
        _userRepo.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync(user);

        var result = await handler.Handle(
            new GetUserByIdQuery(Id: userId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Username.Should().Be(user.Username);
    }

    [Fact]
    public async Task GetById_WhenUserDoesNotExist_ReturnsFailure()
    {
        var userId = Guid.NewGuid();
        var handler = new GetUserByIdHandler(_userRepo.Object);
        _userRepo.Setup(r => r.GetByIdAsync(userId)).ReturnsAsync((User?)null);

        var result = await handler.Handle(
            new GetUserByIdQuery(Id: userId), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
    }

    [Fact]
    public async Task GetByUsername_WhenExists_ReturnsUser()
    {
        var user = CreateUser();
        var username = user.Username;
        var handler = new GetUserByUsernameHandler(_userRepo.Object);
        _userRepo.Setup(r => r.GetByUsernameAsync(username)).ReturnsAsync(user);

        var result = await handler.Handle(
            new GetUserByUsernameQuery(Username: username), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Username.Should().Be(username);
    }

    [Fact]
    public async Task UpdateUser_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new UpdateUserHandler(_userRepo.Object);
        _userRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((User?)null);

        var result = await handler.Handle(
            _fixture.Create<UpdateUserCommand>() with { Id = id, CurrentUserId = id }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task UpdateUser_WhenExists_ReturnsSuccess()
    {
        var user = CreateUser();
        var handler = new UpdateUserHandler(_userRepo.Object);
        _userRepo.Setup(r => r.GetByIdAsync(user.Id)).ReturnsAsync(user);

        string city = _fixture.Faker.Address.City();
        var result = await handler.Handle(
            _fixture.Create<UpdateUserCommand>() with { Id = user.Id, CurrentUserId = user.Id, City = city },
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.City.Should().Be(city);
    }

    [Fact]
    public async Task DeleteUser_WhenExists_ReturnsSuccess()
    {
        var user = CreateUser();
        var handler = new DeleteUserHandler(_userRepo.Object);
        _userRepo.Setup(r => r.GetByIdAsync(user.Id)).ReturnsAsync(user);

        var result = await handler.Handle(
            new DeleteUserCommand(Id: user.Id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _userRepo.Verify(r => r.DeleteAsync(user.Id));
    }

    [Fact]
    public async Task DeleteUser_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new DeleteUserHandler(_userRepo.Object);
        _userRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((User?)null);

        var result = await handler.Handle(
            new DeleteUserCommand(Id: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }
}
