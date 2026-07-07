using MediatR;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.DTOs;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetRouteReviewsByRouteQuery(Guid RouteId, int Page = 1, int PageSize = 20) : IRequest<Result<OffsetPaginatedList<RouteReviewDto>>>;
