using MediatR;
using Cruxa.Application.Features.Routesetters.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routesetters.Queries;

public record GetSetterReviewsQuery : IRequest<Result<List<RouteReviewSummaryDto>>>;
