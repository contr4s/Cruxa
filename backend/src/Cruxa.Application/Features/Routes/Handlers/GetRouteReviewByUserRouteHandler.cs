using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class GetRouteReviewByUserRouteHandler : IRequestHandler<GetRouteReviewByUserRouteQuery, Result<RouteReviewDto?>>
{
    private readonly IRouteReviewRepository _repository;

    public GetRouteReviewByUserRouteHandler(IRouteReviewRepository repository) => _repository = repository;

    public async Task<Result<RouteReviewDto?>> Handle(GetRouteReviewByUserRouteQuery request, CancellationToken ct)
    {
        var review = await _repository.GetByRouteAndUserAsync(request.RouteId, request.UserId);
        return Result.Success(review?.Adapt<RouteReviewDto>());
    }
}
