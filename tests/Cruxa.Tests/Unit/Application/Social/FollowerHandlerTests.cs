using Cruxa.Application.Features.Social.Handlers;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Queries;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Social;

public class FollowerHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IFollowerRepository> _followerRepo = new();

    [Fact]
    public async Task FollowUser_WhenNotFollowing_ReturnsSuccess()
    {
        var handler = new FollowUserHandler(_followerRepo.Object);
        var cmd = _fixture.Create<FollowUserCommand>();
        _followerRepo.Setup(r => r.FollowAsync(cmd.FollowerId, cmd.FolloweeId)).ReturnsAsync(true);

        var result = await handler.Handle(cmd, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _followerRepo.Verify(r => r.FollowAsync(cmd.FollowerId, cmd.FolloweeId));
    }

    [Fact]
    public async Task FollowUser_SelfFollow_ReturnsValidationError()
    {
        var id = Guid.NewGuid();
        var handler = new FollowUserHandler(_followerRepo.Object);

        var result = await handler.Handle(
            new FollowUserCommand(FollowerId: id, FolloweeId: id), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Validation");
    }

    [Fact]
    public async Task IsFollowing_ReturnsBool()
    {
        var handler = new IsFollowingHandler(_followerRepo.Object);
        _followerRepo.Setup(r => r.IsFollowingAsync(It.IsAny<Guid>(), It.IsAny<Guid>())).ReturnsAsync(true);

        var result = await handler.Handle(
            _fixture.Create<IsFollowingQuery>(), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeTrue();
    }
}
