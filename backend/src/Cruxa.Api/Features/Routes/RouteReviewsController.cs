using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Routes.DTOs;

namespace Cruxa.Api.Features.Routes;

[ApiController]
[Route("api/routes/{routeId:guid}/reviews")]
[Authorize]
public class RouteReviewsController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    /// <summary>Get all reviews for a route (public)</summary>
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<OffsetPaginatedList<RouteReviewDto>>> GetByRoute(Guid routeId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new GetRouteReviewsByRouteQuery(routeId, page, pageSize));
        return Ok(result.Value);
    }

    /// <summary>Get current user's review for a route</summary>
    [HttpGet("my")]
    public async Task<ActionResult<RouteReviewDto?>> GetMyReview(Guid routeId)
    {
        var result = await mediator.Send(new GetRouteReviewByUserRouteQuery(routeId, currentUser.GetRequiredUserId()));
        return Ok(result.Value);
    }

    /// <summary>Add or update your review for a route</summary>
    [HttpPost]
    public async Task<ActionResult<RouteReviewDto>> Add(Guid routeId, [FromBody] AddRouteReviewCommand command)
    {
        var cmd = command with { RouteId = routeId, UserId = currentUser.GetRequiredUserId() };
        var result = await mediator.Send(cmd);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetMyReview), new { routeId }, result.Value)
            : BadRequest(result.Error);
    }

    /// <summary>Update your review for a route</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RouteReviewDto>> Update(Guid routeId, Guid id, [FromBody] UpdateRouteReviewCommand command)
    {
        var cmd = command with { Id = id, UserId = currentUser.GetRequiredUserId() };
        var result = await mediator.Send(cmd);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Delete your review for a route</summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Remove(Guid routeId, Guid id)
    {
        var result = await mediator.Send(new DeleteRouteReviewCommand(id, currentUser.GetRequiredUserId()));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
