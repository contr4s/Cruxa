using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routesetters.Queries;
using Cruxa.Application.Features.Routesetters.DTOs;
using Cruxa.Application.Common.Models;

namespace Cruxa.Api.Features.Routesetters;

[ApiController]
[Route("api/routesetters")]
[Authorize(Policy = "RequireRoutesetter")]
public class RoutesetterController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    /// <summary>
    /// Returns aggregated stats for the current routesetter.
    /// </summary>
    [HttpGet("me/stats")]
    public async Task<ActionResult<RoutesetterStatsDto>> GetStats()
    {
        var result = await mediator.Send(new GetRoutesetterStatsQuery());
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    /// <summary>
    /// Returns paginated routes created by the current routesetter.
    /// </summary>
    [HttpGet("me/routes")]
    public async Task<ActionResult<OffsetPaginatedList<RouteDto>>> GetRoutes([FromQuery] RouteFilter filter)
    {
        var result = await mediator.Send(new GetSetterRoutesQuery(filter));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    /// <summary>
    /// Returns feedback/reviews on routes of the current routesetter.
    /// </summary>
    [HttpGet("me/reviews")]
    public async Task<ActionResult<List<RouteReviewSummaryDto>>> GetReviews()
    {
        var result = await mediator.Send(new GetSetterReviewsQuery());
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    /// <summary>
    /// Returns gyms where the current user is linked as a routesetter.
    /// </summary>
    [HttpGet("me/gyms")]
    public async Task<ActionResult<List<LinkedGymSummaryDto>>> GetGyms()
    {
        var result = await mediator.Send(new GetLinkedGymsQuery());
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }
}
