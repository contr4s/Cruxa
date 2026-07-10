using Mapster;
using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class GetRouteReviewsByRouteHandler : IRequestHandler<GetRouteReviewsByRouteQuery, Result<OffsetPaginatedList<RouteReviewDto>>>
{
    private readonly IRouteFeedbackRepository _repository;

    public GetRouteReviewsByRouteHandler(IRouteFeedbackRepository repository) => _repository = repository;

    public async Task<Result<OffsetPaginatedList<RouteReviewDto>>> Handle(GetRouteReviewsByRouteQuery request, CancellationToken ct)
    {
        var (items, totalCount) = await _repository.GetPagedByRouteIdAsync(request.RouteId, request.Page, request.PageSize);
        var dtos = items.Select(r => r.Adapt<RouteReviewDto>()).ToList();
        return Result.Success(new OffsetPaginatedList<RouteReviewDto>(dtos, totalCount, request.Page, request.PageSize));
    }
}
