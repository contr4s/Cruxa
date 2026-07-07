using Cruxa.Application.Common.Interfaces;
using Cruxa.Application.Features.Auth.Handlers;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Auth;

public class RegisterHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<IPasswordCredentialRepository> _credRepo = new();
    private readonly Mock<IJwtTokenGenerator> _jwt = new();
    private readonly Mock<IPasswordHasher> _passwordHasher = new();
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepo = new();
    private readonly RegisterHandler _handler;

    public RegisterHandlerTests()
    {
        _jwt.Setup(j => j.GenerateAccessTokenAsync(It.IsAny<User>())).ReturnsAsync("token");
        _jwt.Setup(j => j.GenerateRefreshTokenAsync()).ReturnsAsync("refresh");
        _passwordHasher.Setup(p => p.Hash(It.IsAny<string>())).Returns("hash");
        _handler = new RegisterHandler(_userRepo.Object, _credRepo.Object, _refreshTokenRepo.Object, _jwt.Object, _passwordHasher.Object);
    }

    [Fact]
    public async Task Register_WhenEmailExists_ReturnsConflict()
    {
        var email = _fixture.Faker.Internet.Email();
        _userRepo.Setup(r => r.ExistsByEmailAsync(email)).ReturnsAsync(true);

        var result = await _handler.Handle(
            _fixture.Create<RegisterCommand>() with { Email = email }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Conflict");
    }

    [Fact]
    public async Task Register_WhenUsernameExists_ReturnsConflict()
    {
        var username = _fixture.Faker.Internet.UserName();
        _userRepo.Setup(r => r.ExistsByUsernameAsync(username)).ReturnsAsync(true);

        var result = await _handler.Handle(
            _fixture.Create<RegisterCommand>() with { Username = username }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Conflict");
    }

    [Fact]
    public async Task Register_WithInvalidEmail_ReturnsFailure()
    {
        var result = await _handler.Handle(
            _fixture.Create<RegisterCommand>() with { Email = "bad-email" }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsSuccess()
    {
        var email= _fixture.Faker.Internet.Email();
        var username = _fixture.Faker.Internet.UserName();
        _userRepo.Setup(r => r.ExistsByEmailAsync(It.IsAny<string>())).ReturnsAsync(false);
        _userRepo.Setup(r => r.ExistsByUsernameAsync(It.IsAny<string>())).ReturnsAsync(false);

        var result = await _handler.Handle(
            _fixture.Create<RegisterCommand>() with { Email = email, Username = username },
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value!.Token.Should().Be("token");
        result.Value.User.Username.Should().Be(username);
    }
}
