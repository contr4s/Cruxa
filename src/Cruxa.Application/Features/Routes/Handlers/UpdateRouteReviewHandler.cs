using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class UpdateRouteReviewHandler : IRequestHandler<UpdateRouteReviewCommand, Result<RouteReviewDto>>
{
    private readonly IRouteReviewRepository _repository;
    private readonly IUnitOfWork _uow;

    public UpdateRouteReviewHandler(IRouteReviewRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

    public async Task<Result<RouteReviewDto>> Handle(UpdateRouteReviewCommand request, CancellationToken ct)
    {
        var review = await _repository.GetByIdAsync(request.Id);
        if (review is null)
            return Result.Failure<RouteReviewDto>(Error.NotFound("Route review not found"));

        if (review.UserId != request.UserId)
            return Result.Failure<RouteReviewDto>(Error.Unauthorized("You can only update your own reviews"));

        review.UpdateReview(request.Rating, request.PrivateNotes, request.PublicReview);
        await _repository.UpdateAsync(review);
        await _uow.SaveChangesAsync(ct);
        return Result.Success(review.Adapt<RouteReviewDto>());
    }
}
