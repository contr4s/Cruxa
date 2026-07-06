using Cruxa.Domain.Entities;
using FluentAssertions;

namespace Cruxa.Tests.Unit.Domain.Entities;

public class RouteReviewTests
{
    private readonly TestFixture _fixture = new();
    private readonly Guid _routeId = Guid.NewGuid();
    private readonly Guid _userId = Guid.NewGuid();

    [Fact]
    public void Create_WithValidData_ReturnsSuccess()
    {
        var rating = _fixture.Faker.Random.Int(1, 5);
        var privateNotes = _fixture.Faker.Lorem.Sentence();
        var publicReview = _fixture.Faker.Lorem.Sentence();
        var result = RouteReview.Create(_routeId, _userId, rating: rating, privateNotes: privateNotes, publicReview: publicReview);

        result.IsSuccess.Should().BeTrue();
        result.Value!.RouteId.Should().Be(_routeId);
        result.Value.UserId.Should().Be(_userId);
        result.Value.Rating.Should().Be(rating);
        result.Value.PrivateNotes.Should().Be(privateNotes);
        result.Value.PublicReview.Should().Be(publicReview);
    }

    [Fact]
    public void Create_WithDefaultRouteId_Throws()
    {
        var act = () => RouteReview.Create(Guid.Empty, _userId);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithDefaultUserId_Throws()
    {
        var act = () => RouteReview.Create(_routeId, Guid.Empty);
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Create_WithRatingOutOfRange_Throws()
    {
        var act = () => RouteReview.Create(_routeId, _userId, rating: 6);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Create_WithRatingBelowRange_Throws()
    {
        var act = () => RouteReview.Create(_routeId, _userId, rating: 0);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }

    [Fact]
    public void Create_WithNoOptionalFields_ReturnsSuccess()
    {
        var result = RouteReview.Create(_routeId, _userId);

        result.IsSuccess.Should().BeTrue();
        result.Value!.Rating.Should().BeNull();
        result.Value.PrivateNotes.Should().BeNull();
        result.Value.PublicReview.Should().BeNull();
    }

    [Fact]
    public void UpdateReview_ChangesValues()
    {
        var review = RouteReview.Create(_routeId, _userId, rating: _fixture.Faker.Random.Int(1, 5)).Value!;

        var rating = _fixture.Faker.Random.Int(1, 5);
        var privateNotes = _fixture.Faker.Lorem.Sentence();
        var publicReview = _fixture.Faker.Lorem.Sentence();
        review.UpdateReview(rating, privateNotes, publicReview);

        review.Rating.Should().Be(rating);
        review.PrivateNotes.Should().Be(privateNotes);
        review.PublicReview.Should().Be(publicReview);
        review.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public void UpdateReview_WithNulls_SetsNulls()
    {
        var initialRating = _fixture.Faker.Random.Int(1, 5);
        var review = RouteReview.Create(_routeId, _userId, rating: initialRating,
            privateNotes: _fixture.Faker.Lorem.Sentence(),
            publicReview: _fixture.Faker.Lorem.Sentence()).Value!;

        review.UpdateReview(null, null, null);

        review.Rating.Should().BeNull();
        review.PrivateNotes.Should().BeNull();
        review.PublicReview.Should().BeNull();
    }

    [Fact]
    public void UpdateReview_WithOutOfRangeRating_Throws()
    {
        var review = RouteReview.Create(_routeId, _userId).Value!;

        var act = () => review.UpdateReview(6, null, null);
        act.Should().Throw<ArgumentOutOfRangeException>();
    }
}
