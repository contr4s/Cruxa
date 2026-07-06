using Cruxa.Domain.Entities;
using Cruxa.Domain.Enums;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Entities;

public class AscentTests
{
    private readonly TestFixture _fixture = new();
    private readonly Guid _postId = Guid.NewGuid();
    private readonly Guid _userId = Guid.NewGuid();
    private readonly Guid _routeId = Guid.NewGuid();

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var style = _fixture.Create<AscentStyle>();
        var result = Ascent.Create(_postId, _userId, _routeId, style);

        result.IsSuccess.Should().BeTrue();
        result.Value!.PostId.Should().Be(_postId);
        result.Value.UserId.Should().Be(_userId);
        result.Value.RouteId.Should().Be(_routeId);
        result.Value.Style.Should().Be(style);
    }

    [Fact]
    public void Create_WithDefaultPostId_Throws()
    {
        var act = () => Ascent.Create(Guid.Empty, _userId, _routeId, AscentStyle.Flash);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithDefaultUserId_Throws()
    {
        var act = () => Ascent.Create(_postId, Guid.Empty, _routeId, AscentStyle.Redpoint);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithDefaultRouteId_Throws()
    {
        var act = () => Ascent.Create(_postId, _userId, Guid.Empty, AscentStyle.TopRope);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithMediaUrls_ReturnsSuccess()
    {
        var result = Ascent.Create(
            _postId, _userId, _routeId, _fixture.Create<AscentStyle>(),
            mediaUrls: ["video.mp4"]);

        result.IsSuccess.Should().BeTrue();
        result.Value!.MediaUrls.Should().Contain("video.mp4");
    }
}
