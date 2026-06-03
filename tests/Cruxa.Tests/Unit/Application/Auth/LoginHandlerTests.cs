using Cruxa.Application.Common.Interfaces;
using Cruxa.Application.Features.Auth.Handlers;
using Cruxa.Application.Features.Auth.Queries;
using Cruxa.Application.Features.Users.Interfaces;
using Cruxa.Domain.Entities;
using Cruxa.Domain.ValueObjects;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Auth;

public class LoginHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<IJwtTokenGenerator> _jwt = new();
    private readonly Mock<IPasswordHasher> _passwordHasher = new();
    private readonly LoginHandler _handler;

    public LoginHandlerTests()
    {
        _passwordHasher.Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<string>())).Returns(true);
        _jwt.Setup(j => j.GenerateTokenAsync(It.IsAny<User>())).ReturnsAsync("token");
        _handler = new LoginHandler(_userRepo.Object, _jwt.Object, _passwordHasher.Object);
    }

    [Fact]
    public async Task Login_WithWrongEmail_ReturnsUnauthorized()
    {
        var email = _fixture.Faker.Internet.Email();
        _userRepo.Setup(r => r.GetByEmailAsync(email)).ReturnsAsync((User?)null);

        var result = await _handler.Handle(
            _fixture.Create<LoginQuery>() with { Email = email }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsAuthResponse()
    {
        var emailAddress = _fixture.Faker.Internet.Email();
        var username = _fixture.Faker.Internet.UserName();
        var email = Email.Create(emailAddress).Value!;
        var userResult = User.Create(email, username, _fixture.Faker.Lorem.Word());
        var user = userResult.Value!;

        _userRepo.Setup(r => r.GetByEmailAsync(emailAddress)).ReturnsAsync(user);

        var result = await _handler.Handle(
            _fixture.Create<LoginQuery>() with { Email = emailAddress },
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Token.Should().Be("token");
    }
}
