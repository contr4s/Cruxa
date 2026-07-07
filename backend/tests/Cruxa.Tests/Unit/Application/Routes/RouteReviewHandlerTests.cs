using Cruxa.Application.Features.Routes.Handlers;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Domain.Entities;
using FluentAssertions;
using Moq;

namespace Cruxa.Tests.Unit.Application.Routes;

public class RouteReviewHandlerTests
{
    private readonly TestFixture _fixture = new();
    private readonly Mock<IRouteReviewRepository> _reviewRepo = new();
    private readonly Guid _userId = Guid.NewGuid();
    private readonly Guid _routeId = Guid.NewGuid();

    [Fact]
    public async Task AddReview_WhenNoExistingReview_ReturnsSuccess()
    {
        var handler = new AddRouteReviewHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByRouteAndUserAsync(_routeId, _userId))
            .ReturnsAsync((RouteReview?)null);

        var rating = _fixture.Faker.Random.Int(1, 5);
        var result = await handler.Handle(
            _fixture.Create<AddRouteReviewCommand>() with { RouteId = _routeId, UserId = _userId, Rating = rating },
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Rating.Should().Be(rating);
    }

    [Fact]
    public async Task AddReview_WhenReviewExists_ReturnsConflict()
    {
        var handler = new AddRouteReviewHandler(_reviewRepo.Object);
        var existing = RouteReview.Create(_routeId, _userId).Value!;
        _reviewRepo.Setup(r => r.GetByRouteAndUserAsync(_routeId, _userId))
            .ReturnsAsync(existing);

        var result = await handler.Handle(
            _fixture.Create<AddRouteReviewCommand>() with { RouteId = _routeId, UserId = _userId },
            CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Conflict");
    }

    [Fact]
    public async Task UpdateReview_WhenExists_ReturnsSuccess()
    {
        var initialRating = _fixture.Faker.Random.Int(1, 5);
        var newRating = _fixture.Faker.Random.Int(1, 5);
        var newPrivateNotes = _fixture.Faker.Lorem.Sentence();
        var newPublicReview = _fixture.Faker.Lorem.Sentence();
        var review = RouteReview.Create(_routeId, _userId, rating: initialRating).Value!;
        var handler = new UpdateRouteReviewHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByIdAsync(review.Id)).ReturnsAsync(review);

        var result = await handler.Handle(
            new UpdateRouteReviewCommand(Id: review.Id, UserId: _userId, Rating: newRating, PrivateNotes: newPrivateNotes, PublicReview: newPublicReview),
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Rating.Should().Be(newRating);
        result.Value.PrivateNotes.Should().Be(newPrivateNotes);
    }

    [Fact]
    public async Task UpdateReview_WhenNotExists_ReturnsNotFound()
    {
        var handler = new UpdateRouteReviewHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((RouteReview?)null);

        var result = await handler.Handle(
            _fixture.Create<UpdateRouteReviewCommand>() with { UserId = _userId }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task UpdateReview_WhenNotOwnReview_ReturnsUnauthorized()
    {
        var review = RouteReview.Create(_routeId, _userId).Value!;
        var handler = new UpdateRouteReviewHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByIdAsync(review.Id)).ReturnsAsync(review);

        var result = await handler.Handle(
            _fixture.Create<UpdateRouteReviewCommand>() with { Id = review.Id }, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("Unauthorized");
    }

    [Fact]
    public async Task DeleteReview_WhenExistsAndOwn_ReturnsSuccess()
    {
        var review = RouteReview.Create(_routeId, _userId).Value!;
        var handler = new DeleteRouteReviewHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByIdAsync(review.Id)).ReturnsAsync(review);

        var result = await handler.Handle(
            new DeleteRouteReviewCommand(Id: review.Id, UserId: _userId),
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _reviewRepo.Verify(r => r.DeleteAsync(review.Id));
    }

    [Fact]
    public async Task DeleteReview_WhenNotExists_ReturnsNotFound()
    {
        var handler = new DeleteRouteReviewHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((RouteReview?)null);

        var result = await handler.Handle(
            _fixture.Create<DeleteRouteReviewCommand>(), CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("NotFound");
    }

    [Fact]
    public async Task GetReviewsByRoute_ReturnsReviews()
    {
        var rating1 = _fixture.Faker.Random.Int(1, 5);
        var rating2 = _fixture.Faker.Random.Int(1, 5);
        var review1 = RouteReview.Create(_routeId, Guid.NewGuid(), rating: rating1).Value!;
        var review2 = RouteReview.Create(_routeId, Guid.NewGuid(), rating: rating2).Value!;
        var handler = new GetRouteReviewsByRouteHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetPagedByRouteIdAsync(_routeId, 1, 20))
            .ReturnsAsync((new List<RouteReview> { review1, review2 }, 2));

        var result = await handler.Handle(
            new GetRouteReviewsByRouteQuery(RouteId: _routeId, Page: 1, PageSize: 20), CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Items.Should().HaveCount(2);
        result.Value.Items.Should().Contain(r => r.Rating == rating1);
        result.Value.Items.Should().Contain(r => r.Rating == rating2);
        result.Value.TotalCount.Should().Be(2);
    }

    [Fact]
    public async Task GetReviewByUserRoute_WhenExists_ReturnsReview()
    {
        var rating = _fixture.Faker.Random.Int(1, 5);
        var review = RouteReview.Create(_routeId, _userId, rating: rating).Value!;
        var handler = new GetRouteReviewByUserRouteHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByRouteAndUserAsync(_routeId, _userId)).ReturnsAsync(review);

        var result = await handler.Handle(
            new GetRouteReviewByUserRouteQuery(RouteId: _routeId, UserId: _userId),
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Should().NotBeNull();
        result.Value!.Rating.Should().Be(rating);
    }

    [Fact]
    public async Task GetReviewByUserRoute_WhenNotExists_ReturnsNull()
    {
        var handler = new GetRouteReviewByUserRouteHandler(_reviewRepo.Object);
        _reviewRepo.Setup(r => r.GetByRouteAndUserAsync(_routeId, _userId))
            .ReturnsAsync((RouteReview?)null);

        var result = await handler.Handle(
            new GetRouteReviewByUserRouteQuery(RouteId: _routeId, UserId: _userId),
            CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeNull();
    }
}
