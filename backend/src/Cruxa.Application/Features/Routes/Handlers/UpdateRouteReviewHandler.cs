using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class UpdateRouteReviewHandler : IRequestHandler<UpdateRouteReviewCommand, Result<RouteReviewDto>>
{
    private readonly IRouteFeedbackRepository _repository;

    public UpdateRouteReviewHandler(IRouteFeedbackRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<RouteReviewDto>> Handle(UpdateRouteReviewCommand request, CancellationToken ct)
    {
        var review = await _repository.GetByIdAsync(request.Id);
        if (review is null)
            return Result.Failure<RouteReviewDto>(Error.NotFound("Route review not found"));

        if (review.UserId != request.UserId)
            return Result.Failure<RouteReviewDto>(Error.Unauthorized("You can only update your own reviews"));

        review.UpdateFeedback(request.Rating, request.PrivateNotes, request.PublicReview, null);
        await _repository.UpdateAsync(review);
        return Result.Success(review.Adapt<RouteReviewDto>());
    }
}
