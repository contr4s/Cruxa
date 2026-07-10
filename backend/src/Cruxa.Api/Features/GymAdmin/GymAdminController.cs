using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.GymAdmin.Queries;
using Cruxa.Application.Features.GymAdmin.Commands;
using Cruxa.Application.Features.GymAdmin.DTOs;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Common.Models;

namespace Cruxa.Api.Features.GymAdmin;

[ApiController]
[Route("api/gyms")]
[Authorize(Policy = "RequireGymAdmin")]
public class GymAdminController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Returns admin-level stats for a specific gym.
    /// </summary>
    [HttpGet("{id:guid}/admin-stats")]
    public async Task<ActionResult<GymAdminStatsDto>> GetAdminStats(Guid id)
    {
        var result = await mediator.Send(new GetGymAdminStatsQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    /// <summary>
    /// Returns paginated routes for a gym with full admin filters.
    /// </summary>
    [HttpGet("{id:guid}/admin-routes")]
    public async Task<ActionResult<OffsetPaginatedList<RouteDto>>> GetAdminRoutes(Guid id, [FromQuery] RouteFilter filter)
    {
        var result = await mediator.Send(new GetAdminRoutesQuery(id, filter));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    /// <summary>
    /// Returns activity data for a gym over the last 30 days.
    /// </summary>
    [HttpGet("{id:guid}/activity")]
    public async Task<ActionResult<GymActivityDto>> GetActivity(Guid id)
    {
        var result = await mediator.Send(new GetGymActivityQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    /// <summary>
    /// Returns routesetters linked to a gym.
    /// </summary>
    [HttpGet("{id:guid}/setters")]
    public async Task<ActionResult<List<SetterManagementItemDto>>> GetSetters(Guid id)
    {
        var result = await mediator.Send(new GetGymSettersQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    /// <summary>
    /// Links a user as routesetter to a gym.
    /// </summary>
    [HttpPost("{id:guid}/setters")]
    public async Task<IActionResult> LinkSetter(Guid id, [FromBody] LinkSetterRequest request)
    {
        var result = await mediator.Send(new LinkSetterCommand(id, request.UserId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>
    /// Unlinks a routesetter from a gym.
    /// </summary>
    [HttpDelete("{id:guid}/setters/{userId:guid}")]
    public async Task<IActionResult> UnlinkSetter(Guid id, Guid userId)
    {
        var result = await mediator.Send(new UnlinkSetterCommand(id, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}

public record LinkSetterRequest(Guid UserId);
