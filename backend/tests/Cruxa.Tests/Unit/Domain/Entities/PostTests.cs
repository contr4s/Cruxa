using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Entities;

public class PostTests
{
    private readonly TestFixture _fixture = new();
    private readonly Guid _userId = Guid.NewGuid();
    private readonly Guid _gymId = Guid.NewGuid();

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var description = _fixture.Faker.Lorem.Sentence();
        var result = Post.Create(_userId, _gymId, description, null);

        result.IsSuccess.Should().BeTrue();
        result.Value!.UserId.Should().Be(_userId);
        result.Value.GymId.Should().Be(_gymId);
        result.Value.Description.Should().Be(description);
        result.Value.Status.Should().Be(PostStatus.Draft);
        result.Value.Visibility.Should().Be(PostVisibility.Public);
    }

    [Fact]
    public void Create_WithDefaultUserId_Throws()
    {
        var act = () => Post.Create(Guid.Empty, _gymId, _fixture.Faker.Lorem.Sentence(), null);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithDefaultGymId_Throws()
    {
        var act = () => Post.Create(_userId, Guid.Empty, _fixture.Faker.Lorem.Sentence(), null);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Publish_SetsStatusToPublished()
    {
        var post = Post.Create(_userId, _gymId, _fixture.Faker.Lorem.Sentence(), null).Value!;

        post.Publish();

        post.Status.Should().Be(PostStatus.Published);
    }

    [Fact]
    public void Publish_WhenAlreadyPublished_DoesNotFail()
    {
        var post = Post.Create(_userId, _gymId, _fixture.Faker.Lorem.Sentence(), null).Value!;
        post.Publish();

        post.Publish();

        post.Status.Should().Be(PostStatus.Published);
    }

    [Fact]
    public void Update_ChangesFields()
    {
        var post = Post.Create(_userId, _gymId, _fixture.Faker.Lorem.Sentence(), null).Value!;
        var description = _fixture.Faker.Lorem.Sentence();

        post.Update(description, ["photo.jpg"], PostVisibility.Followers);

        post.Description.Should().Be(description);
        post.MediaUrls.Should().Contain("photo.jpg");
        post.Visibility.Should().Be(PostVisibility.Followers);
    }

    [Fact]
    public void Update_WithNulls_DoesNotChange()
    {
        var desc = _fixture.Faker.Lorem.Sentence();
        var post = Post.Create(_userId, _gymId, desc, null).Value!;

        post.Update(null, null, null);

        post.Description.Should().Be(desc);
    }

    [Fact]
    public void AddAscent_AddsToCollection()
    {
        var post = Post.Create(_userId, _gymId, _fixture.Faker.Lorem.Sentence(), null).Value!;
        var ascent = Ascent.Create(Guid.NewGuid(), _userId, Guid.NewGuid(), _fixture.Create<AscentStyle>()).Value!;

        post.AddAscent(ascent);

        post.Ascents.Should().Contain(ascent);
    }
}
