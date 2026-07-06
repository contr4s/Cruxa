using Cruxa.Application.Features.Social.Handlers;
using Cruxa.Application.Features.Social.Interfaces;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Cruxa.Application.Common.Interfaces;
using Moq;

namespace Cruxa.Tests.Unit.Application.Social;

public class CommentHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<ICommentRepository> _commentRepo = new();

    [Fact]
    public async Task AddComment_ReturnsCommentDto()
    {
        var handler = new AddCommentHandler(_commentRepo.Object);

        var content = _fixture.Faker.Lorem.Sentence();
        var result = await handler.Handle(
            _fixture.Create<AddCommentCommand>() with { Content = content }, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Content.Should().Be(content);
    }

    [Fact]
    public async Task DeleteComment_WhenNotFound_ReturnsNotFound()
    {
        var handler = new DeleteCommentHandler(_commentRepo.Object);
        _commentRepo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Comment?)null);

        var result = await handler.Handle(
            _fixture.Create<DeleteCommentCommand>(), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task DeleteComment_WhenNotOwn_ReturnsUnauthorized()
    {
        var userId = Guid.NewGuid();
        var comment = Comment.Create(Guid.NewGuid(), userId, _fixture.Faker.Lorem.Sentence()).Value!;
        var handler = new DeleteCommentHandler(_commentRepo.Object);
        _commentRepo.Setup(r => r.GetByIdAsync(comment.Id)).ReturnsAsync(comment);

        var result = await handler.Handle(
            _fixture.Create<DeleteCommentCommand>() with { CommentId = comment.Id }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task GetCommentsByPost_ReturnsComments()
    {
        var postId = Guid.NewGuid();
        var comments = new[]
        {
            Comment.Create(postId, Guid.NewGuid(), _fixture.Faker.Lorem.Sentence()).Value!,
            Comment.Create(postId, Guid.NewGuid(), _fixture.Faker.Lorem.Sentence()).Value!
        };
        var handler = new GetCommentsByPostHandler(_commentRepo.Object);
        _commentRepo.Setup(r => r.GetByPostIdAsync(postId)).ReturnsAsync(comments);

        var result = await handler.Handle(
            new GetCommentsByPostQuery(postId), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().HaveCount(2);
        result.Value.Should().Contain(c => c.Content == comments[0].Content);
        result.Value.Should().Contain(c => c.Content == comments[1].Content);
    }
}
