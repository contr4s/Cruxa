using Bogus;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Ascents.Handlers;
using Cruxa.Application.Features.Ascents.Contracts;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using FluentAssertions;
using Cruxa.Application.Common.Contracts;
using Moq;

namespace Cruxa.Tests.Unit.Application.Ascents;

public class AscentHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IAscentRepository> _ascentRepo = new();
    private readonly Mock<IPostRepository> _postRepo = new();
    private readonly Mock<IRouteRepository> _routeRepo = new();
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
        var handler = new AddAscentHandler(_ascentRepo.Object, _postRepo.Object, _routeRepo.Object);
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
        var handler = new AddAscentHandler(_ascentRepo.Object, _postRepo.Object, _routeRepo.Object);
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
        var handler = new AddAscentHandler(_ascentRepo.Object, _postRepo.Object, _routeRepo.Object);
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
        _ascentRepo.Setup(r => r.GetByPostPagedAsync(postId, 1, 20)).ReturnsAsync((ascents.ToList(), 2));

        var result = await handler.Handle(new GetAscentsByPostQuery(postId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().HaveCount(2);
        result.Value.Items.Should().AllSatisfy(a => a.Style.Should().Be(style));
    }

    [Fact]
    public async Task UpdateAscent_WhenExistsAndOwn_ReturnsSuccess()
    {
        var routeId = Guid.NewGuid();
        var ascent = Ascent.Create(Guid.NewGuid(), _userId, routeId, AscentStyle.Onsight).Value!;
        var handler = new UpdateAscentHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByIdAsync(ascent.Id)).ReturnsAsync(ascent);

        var result = await handler.Handle(
            new UpdateAscentCommand(ascent.Id, _userId, AscentStyle.Flash), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Style.Should().Be(AscentStyle.Flash);
        _ascentRepo.Verify(r => r.UpdateAsync(ascent));
    }

    [Fact]
    public async Task UpdateAscent_WhenNotExists_ReturnsNotFound()
    {
        var id = Guid.NewGuid();
        var handler = new UpdateAscentHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Ascent?)null);

        var result = await handler.Handle(
            new UpdateAscentCommand(id, _userId, AscentStyle.Flash), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task UpdateAscent_WhenNotOwn_ReturnsUnauthorized()
    {
        var routeId = Guid.NewGuid();
        var ascent = Ascent.Create(Guid.NewGuid(), _userId, routeId, AscentStyle.Onsight).Value!;
        var handler = new UpdateAscentHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByIdAsync(ascent.Id)).ReturnsAsync(ascent);

        var result = await handler.Handle(
            new UpdateAscentCommand(ascent.Id, Guid.NewGuid(), AscentStyle.Flash), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task RemoveAscent_WhenExistsAndOwn_ReturnsSuccess()
    {
        var routeId = Guid.NewGuid();
        var ascent = Ascent.Create(Guid.NewGuid(), _userId, routeId, AscentStyle.Onsight).Value!;
        var handler = new RemoveAscentHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByIdAsync(ascent.Id)).ReturnsAsync(ascent);

        var result = await handler.Handle(
            new RemoveAscentCommand(ascent.Id, _userId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _ascentRepo.Verify(r => r.DeleteAsync(ascent.Id));
    }

    [Fact]
    public async Task RemoveAscent_WhenNotOwn_ReturnsUnauthorized()
    {
        var routeId = Guid.NewGuid();
        var ascent = Ascent.Create(Guid.NewGuid(), _userId, routeId, AscentStyle.Onsight).Value!;
        var handler = new RemoveAscentHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByIdAsync(ascent.Id)).ReturnsAsync(ascent);

        var result = await handler.Handle(
            new RemoveAscentCommand(ascent.Id, Guid.NewGuid()), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task GetAscentsByUser_ReturnsAscents()
    {
        var routeId = Guid.NewGuid();
        var style = _fixture.Create<AscentStyle>();
        var ascent1 = Ascent.Create(Guid.NewGuid(), _userId, routeId, style).Value!;
        var ascent2 = Ascent.Create(Guid.NewGuid(), _userId, routeId, style).Value!;
        var ascents = new[] { ascent1, ascent2 };
        var handler = new GetAscentsByUserHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByUserPagedAsync(_userId, 1, 20)).ReturnsAsync((ascents.ToList(), 2));

        var result = await handler.Handle(new GetAscentsByUserQuery(_userId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().HaveCount(2);
        result.Value.Items.Should().AllSatisfy(a => a.Style.Should().Be(style));
    }

    [Fact]
    public async Task GetAscentsByPost_RespectsPagination()
    {
        var postId = Guid.NewGuid();
        var routeId = Guid.NewGuid();
        var ascents = Enumerable.Range(0, 5)
            .Select(_ => Ascent.Create(postId, _userId, routeId, AscentStyle.Onsight).Value!)
            .ToArray();
        var handler = new GetAscentsByPostHandler(_ascentRepo.Object);
        _ascentRepo.Setup(r => r.GetByPostPagedAsync(postId, 2, 2)).ReturnsAsync((ascents.Skip(2).Take(2).ToList(), 5));

        var result = await handler.Handle(new GetAscentsByPostQuery(postId, 2, 2), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().HaveCount(2);
        result.Value.TotalCount.Should().Be(5);
        result.Value.Page.Should().Be(2);
        result.Value.HasNextPage.Should().BeTrue();
        result.Value.HasPreviousPage.Should().BeTrue();
    }
}
