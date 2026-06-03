using Cruxa.Application.Features.Social.Handlers;
using Cruxa.Application.Features.Social.Interfaces;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Social;

public class LikeHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<ILikeRepository> _likeRepo = new();

    [Fact]
    public async Task LikePost_WhenNotLiked_ReturnsSuccess()
    {
        var handler = new LikePostHandler(_likeRepo.Object);
        var cmd = _fixture.Create<LikePostCommand>();
        _likeRepo.Setup(r => r.LikePostAsync(cmd.PostId, cmd.UserId)).ReturnsAsync(true);

        var result = await handler.Handle(cmd, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _likeRepo.Verify(r => r.LikePostAsync(cmd.PostId, cmd.UserId));
    }

    [Fact]
    public async Task LikePost_WhenAlreadyLiked_ReturnsConflict()
    {
        var handler = new LikePostHandler(_likeRepo.Object);
        _likeRepo.Setup(r => r.LikePostAsync(It.IsAny<Guid>(), It.IsAny<Guid>())).ReturnsAsync(false);

        var result = await handler.Handle(
            _fixture.Create<LikePostCommand>(), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Conflict");
    }

    [Fact]
    public async Task UnlikePost_ReturnsSuccess()
    {
        var handler = new UnlikePostHandler(_likeRepo.Object);
        var cmd = _fixture.Create<UnlikePostCommand>();
        _likeRepo.Setup(r => r.UnlikePostAsync(cmd.PostId, cmd.UserId)).ReturnsAsync(true);

        var result = await handler.Handle(cmd, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _likeRepo.Verify(r => r.UnlikePostAsync(cmd.PostId, cmd.UserId));
    }
}
