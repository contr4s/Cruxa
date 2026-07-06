using Mapster;
using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class GetRouteReviewsByRouteHandler : IRequestHandler<GetRouteReviewsByRouteQuery, Result<IEnumerable<RouteReviewDto>>>
{
    private readonly IRouteReviewRepository _repository;

    public GetRouteReviewsByRouteHandler(IRouteReviewRepository repository) => _repository = repository;

    public async Task<Result<IEnumerable<RouteReviewDto>>> Handle(GetRouteReviewsByRouteQuery request, CancellationToken ct)
    {
        var reviews = await _repository.GetByRouteIdAsync(request.RouteId);
        return Result.Success(reviews.Select(r => r.Adapt<RouteReviewDto>()));
    }
}
