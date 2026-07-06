using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using Cruxa.Domain.ValueObjects;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Entities;

public class UserTests
{
    private readonly TestFixture _fixture = new();

    private User CreateUser()
    {
        var email = Email.Create(_fixture.Faker.Internet.Email()).Value!;
        var result = User.Create(email, _fixture.Faker.Internet.UserName(), _fixture.Faker.Lorem.Word());
        return result.Value!;
    }

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var email = Email.Create(_fixture.Faker.Internet.Email()).Value!;
        var username = _fixture.Faker.Internet.UserName();
        var result = User.Create(email, username, _fixture.Faker.Lorem.Word());

        result.IsSuccess.Should().BeTrue();
        result.Value!.Username.Should().Be(username);
        result.Value.Email.Should().Be(email);
        result.Value.Role.Should().Be(Role.Climber);
        result.Value.Posts.Should().BeEmpty();
    }

    [Fact]
    public void Create_WithEmptyUsername_Throws()
    {
        var email = Email.Create(_fixture.Faker.Internet.Email()).Value!;
        var act = () => User.Create(email, "  ", _fixture.Faker.Lorem.Word());
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void UpdateProfile_UpdatesFields()
    {
        var user = CreateUser();
        var avatarUrl = _fixture.Faker.Internet.Url();
        var city = _fixture.Faker.Address.City();

        user.UpdateProfile(avatarUrl, city);

        user.AvatarUrl.Should().Be(avatarUrl);
        user.City.Should().Be(city);
    }

    [Fact]
    public void UpdateProfile_NullValues_DoesNotChange()
    {
        var user = CreateUser();
        var avatarUrl = user.AvatarUrl;
        var city = user.City;
        user.UpdateProfile(avatarUrl, city);

        user.UpdateProfile(null, null);

        user.AvatarUrl.Should().Be(avatarUrl);
        user.City.Should().Be(city);
    }

    [Fact]
    public void ChangePassword_WithWrongCurrentHash_ReturnsValidationError()
    {
        var user = CreateUser();
        var currentHash = user.PasswordHash;

        var result = user.ChangePassword(_fixture.Faker.Lorem.Word(), _fixture.Faker.Lorem.Word());

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public void ChangePassword_WithCorrectCurrentHash_ReturnsSuccess()
    {
        var user = CreateUser();

        var result = user.ChangePassword(user.PasswordHash, _fixture.Faker.Lorem.Word());

        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void ChangeRole_UpdatesRole()
    {
        var user = CreateUser();

        var newRole = _fixture.Create<Role>();
        user.ChangeRole(newRole);

        user.Role.Should().Be(newRole);
    }
}
