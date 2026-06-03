using Cruxa.Application.Features.Ascents.Handlers;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Posts.Interfaces;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Ascents;

public class AscentHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IAscentRepository> _ascentRepo = new();
    private readonly Mock<IPostRepository> _postRepo = new();
    private readonly Guid _userId = Guid.NewGuid();
    private readonly Guid _gymId = Guid.NewGuid();

    private Post CreatePost()
    {
        var result = Post.Create(_userId, _gymId, _fixture.Faker.Lorem.Sentence(), null);
        return result.Value!;
    }

    [Fact]
    public async Task AddAscent_WhenPostNotFound_ReturnsNotFound()
    {
        var handler = new AddAscentHandler(_ascentRepo.Object, _postRepo.Object);
        _postRepo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Post?)null);

        var result = await handler.Handle(
            _fixture.Create<AddAscentCommand>(), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task AddAscent_WhenNotOwnPost_ReturnsUnauthorized()
    {
        var post = CreatePost();
        var handler = new AddAscentHandler(_ascentRepo.Object, _postRepo.Object);
        _postRepo.Setup(r => r.GetByIdAsync(post.Id)).ReturnsAsync(post);

        var result = await handler.Handle(
            _fixture.Create<AddAscentCommand>() with { PostId = post.Id }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task AddAscent_WhenOwnPost_ReturnsSuccess()
    {
        var post = CreatePost();
        var cmd = _fixture.Create<AddAscentCommand>() with { PostId = post.Id, UserId = _userId };
        var handler = new AddAscentHandler(_ascentRepo.Object, _postRepo.Object);
        _postRepo.Setup(r => r.GetByIdAsync(post.Id)).ReturnsAsync(post);

        var result = await handler.Handle(cmd, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _ascentRepo.Verify(r => r.AddAsync(It.Is<Ascent>(a =>
            a.PostId == cmd.PostId && a.UserId == cmd.UserId)));
    }

    [Fact]
    public async Task GetAscentsByPost_ReturnsAscents()
    {
        var postId = Guid.NewGuid();
        var routeId = Guid.NewGuid();
        var style = _fixture.Create<AscentStyle>();
        var ascent1 = Ascent.Create(postId, _userId, routeId, style).Value!;
        var ascent2 = Ascent.Create(postId, _userId, routeId, style).Value!;
        var ascents = new[] { ascent1, ascent2 };
        var handler = new GetAscentsByPostHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByPostIdAsync(postId)).ReturnsAsync(ascents);

        var result = await handler.Handle(new GetAscentsByPostQuery(postId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(2);
        result.Value.Should().AllSatisfy(a => a.Style.Should().Be(style));
    }
}
