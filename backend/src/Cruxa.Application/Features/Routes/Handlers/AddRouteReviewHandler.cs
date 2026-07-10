using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class AddRouteReviewHandler : IRequestHandler<AddRouteReviewCommand, Result<RouteReviewDto>>
{
    private readonly IRouteFeedbackRepository _repository;

    public AddRouteReviewHandler(IRouteFeedbackRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<RouteReviewDto>> Handle(AddRouteReviewCommand request, CancellationToken ct)
    {
        var existing = await _repository.GetByRouteAndUserAsync(request.RouteId, request.UserId);
        if (existing is not null)
            return Result.Failure<RouteReviewDto>(Error.Conflict("You have already reviewed this route. Use update instead."));

        var reviewResult = Cruxa.Domain.Entities.RouteFeedback.Create(
            request.RouteId, request.UserId, request.Rating, request.PrivateNotes, request.PublicReview);

        if (reviewResult.IsFailure)
            return Result.Failure<RouteReviewDto>(reviewResult.Error);

        await _repository.AddAsync(reviewResult.Value);
        return Result.Success(reviewResult.Value.Adapt<RouteReviewDto>());
    }
}
