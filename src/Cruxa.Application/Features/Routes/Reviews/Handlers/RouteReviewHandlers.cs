using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Reviews.Interfaces;
using Cruxa.Application.Features.Routes.Reviews.Commands;
using Cruxa.Application.Features.Routes.Reviews.Queries;
using Cruxa.Application.Features.Routes.Reviews.DTOs;
using Cruxa.Domain.Common;
using DomainRouteReview = Cruxa.Domain.Entities.RouteReview;

namespace Cruxa.Application.Features.Routes.Reviews.Handlers;

public sealed class AddRouteReviewHandler : IRequestHandler<AddRouteReviewCommand, Result<RouteReviewDto>>
{
    private readonly IRouteReviewRepository _repository;

    public AddRouteReviewHandler(IRouteReviewRepository repository) => _repository = repository;

    public async Task<Result<RouteReviewDto>> Handle(AddRouteReviewCommand request, CancellationToken ct)
    {
        var existing = await _repository.GetByRouteAndUserAsync(request.RouteId, request.UserId);
        if (existing is not null)
            return Result.Failure<RouteReviewDto>(Error.Conflict("You have already reviewed this route. Use update instead."));

        var reviewResult = DomainRouteReview.Create(
            request.RouteId, request.UserId, request.Rating, request.PrivateNotes, request.PublicReview);

        if (reviewResult.IsFailure)
            return Result.Failure<RouteReviewDto>(reviewResult.Error);

        await _repository.AddAsync(reviewResult.Value);
        return Result.Success(reviewResult.Value.Adapt<RouteReviewDto>());
    }
}

public sealed class UpdateRouteReviewHandler : IRequestHandler<UpdateRouteReviewCommand, Result<RouteReviewDto>>
{
    private readonly IRouteReviewRepository _repository;

    public UpdateRouteReviewHandler(IRouteReviewRepository repository) => _repository = repository;

    public async Task<Result<RouteReviewDto>> Handle(UpdateRouteReviewCommand request, CancellationToken ct)
    {
        var review = await _repository.GetByIdAsync(request.Id);
        if (review is null)
            return Result.Failure<RouteReviewDto>(Error.NotFound("Route review not found"));

        if (review.UserId != request.UserId)
            return Result.Failure<RouteReviewDto>(Error.Unauthorized("You can only update your own reviews"));

        review.UpdateReview(request.Rating, request.PrivateNotes, request.PublicReview);
        await _repository.UpdateAsync(review);
        return Result.Success(review.Adapt<RouteReviewDto>());
    }
}

public sealed class DeleteRouteReviewHandler : IRequestHandler<DeleteRouteReviewCommand, Result>
{
    private readonly IRouteReviewRepository _repository;

    public DeleteRouteReviewHandler(IRouteReviewRepository repository) => _repository = repository;

    public async Task<Result> Handle(DeleteRouteReviewCommand request, CancellationToken ct)
    {
        var review = await _repository.GetByIdAsync(request.Id);
        if (review is null)
            return Result.Failure(Error.NotFound("Route review not found"));

        if (review.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only delete your own reviews"));

        await _repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}

public sealed class GetRouteReviewsByRouteHandler : IRequestHandler<GetRouteReviewsByRouteQuery, Result<IEnumerable<RouteReviewDto>>>
{
    private readonly IRouteReviewRepository _repository;

    public GetRouteReviewsByRouteHandler(IRouteReviewRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<RouteReviewDto>>> Handle(GetRouteReviewsByRouteQuery request, CancellationToken ct)
    {
        var reviews = await _repository.GetByRouteIdAsync(request.RouteId);
        var dtos = reviews.Select(r => new RouteReviewDto
        {
            Id = r.Id,
            RouteId = r.RouteId,
            UserId = r.UserId,
            Username = r.User?.Username,
            Rating = r.Rating,
            PrivateNotes = r.PrivateNotes,
            PublicReview = r.PublicReview,
            CreatedAt = r.CreatedAt,
            UpdatedAt = r.UpdatedAt
        });
        return Result.Success(dtos);
    }
}

public sealed class GetRouteReviewByUserRouteHandler : IRequestHandler<GetRouteReviewByUserRouteQuery, Result<RouteReviewDto?>>
{
    private readonly IRouteReviewRepository _repository;

    public GetRouteReviewByUserRouteHandler(IRouteReviewRepository repository) => _repository = repository;

    public async Task<Result<RouteReviewDto?>> Handle(GetRouteReviewByUserRouteQuery request, CancellationToken ct)
    {
        var review = await _repository.GetByRouteAndUserAsync(request.RouteId, request.UserId);
        if (review is null)
            return Result.Success<RouteReviewDto?>(null);

        return Result.Success<RouteReviewDto?>(new RouteReviewDto
        {
            Id = review.Id,
            RouteId = review.RouteId,
            UserId = review.UserId,
            Username = review.User?.Username,
            Rating = review.Rating,
            PrivateNotes = review.PrivateNotes,
            PublicReview = review.PublicReview,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        });
    }
}
