using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.Handlers;
using Cruxa.Application.Features.Posts.Contracts;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Social.Contracts;
using Cruxa.Application.Features.Statistics.Services;
using Cruxa.Application.Features.Statistics.Options;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Cruxa.Application.Common.Contracts;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace Cruxa.Tests.Unit.Application.Posts;

public class PostHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IPostRepository> _postRepo = new();
    private readonly Mock<IFollowerRepository> _followerRepo = new();
    private readonly Mock<IStatsRepository> _statsRepo = new();
    private readonly KruscoreService _kruscore;
    private readonly Guid _userId = Guid.NewGuid();
    private readonly Guid _gymId = Guid.NewGuid();

    public PostHandlerTests()
    {
        _kruscore = new KruscoreService(_statsRepo.Object,
            Mock.Of<ILogger<KruscoreService>>(),
            Options.Create(new KruscoreOptions()));
        _statsRepo.Setup(r => r.GetLastSnapshotBeforeAsync(It.IsAny<Guid>(), It.IsAny<DateOnly>()))
            .ReturnsAsync((UserScoreSnapshot?)null);
        _statsRepo.Setup(r => r.GetAllAscentsOrderedAsync(It.IsAny<Guid>()))
            .ReturnsAsync([]);
    }

    private Post CreatePost()
    {
        var result = Post.Create(_userId, _gymId, _fixture.Faker.Lorem.Sentence(), null);
        return result.Value!;
    }

    [Fact]
    public async Task CreatePost_ReturnsSuccess()
    {
        var handler = new CreatePostHandler(_postRepo.Object);
        var desc = _fixture.Faker.Lorem.Sentence();

        var result = await handler.Handle(
            _fixture.Create<CreatePostCommand>() with { UserId = _userId, GymId = _gymId, Description = desc },
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Description.Should().Be(desc);
    }

    [Fact]
    public async Task UpdatePost_WhenNotFound_ReturnsNotFound()
    {
        var handler = new UpdatePostHandler(_postRepo.Object, _kruscore);
        _postRepo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Post?)null);

        var result = await handler.Handle(
            _fixture.Create<UpdatePostCommand>() with { UserId = _userId }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task UpdatePost_WhenNotOwn_ReturnsUnauthorized()
    {
        var post = CreatePost();
        var handler = new UpdatePostHandler(_postRepo.Object, _kruscore);
        _postRepo.Setup(r => r.GetByIdAsync(post.Id)).ReturnsAsync(post);

        var result = await handler.Handle(
            _fixture.Create<UpdatePostCommand>() with { Id = post.Id }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task PublishPost_WhenOwn_ReturnsSuccess()
    {
        var post = CreatePost();
        var handler = new PublishPostHandler(_postRepo.Object, _kruscore);
        _postRepo.Setup(r => r.GetByIdAsync(post.Id)).ReturnsAsync(post);

        var result = await handler.Handle(
            new PublishPostCommand(Id: post.Id, UserId: _userId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _postRepo.Verify(r => r.UpdateAsync(post));
    }

    [Fact]
    public async Task DeletePost_WhenNotOwn_ReturnsUnauthorized()
    {
        var post = CreatePost();
        var handler = new DeletePostHandler(_postRepo.Object);
        _postRepo.Setup(r => r.GetByIdAsync(post.Id)).ReturnsAsync(post);

        var result = await handler.Handle(
            _fixture.Create<DeletePostCommand>() with { Id = post.Id }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task GetPostById_WhenExists_ReturnsPost()
    {
        var post = CreatePost();
        var handler = new GetPostByIdHandler(_postRepo.Object);
        _postRepo.Setup(r => r.GetByIdAsync(post.Id)).ReturnsAsync(post);

        var result = await handler.Handle(
            new GetPostByIdQuery(Id: post.Id), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Description.Should().Be(post.Description);
    }

    [Fact]
    public async Task GetFeed_ReturnsPosts()
    {
        var post = CreatePost();
        post.Publish();
        var handler = new GetFeedHandler(_postRepo.Object, _followerRepo.Object);
        _followerRepo.Setup(r => r.GetFollowingAsync(_userId)).ReturnsAsync([]);
        _postRepo.Setup(r => r.GetAllAsync()).ReturnsAsync([post]);

        var result = await handler.Handle(
            new GetFeedQuery(_userId, 1, 10), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().HaveCount(1);
        result.Value.Items.Should().Contain(p => p.Description == post.Description);
    }
}
