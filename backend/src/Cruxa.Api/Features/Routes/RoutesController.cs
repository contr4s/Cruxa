using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Common.Models;

namespace Cruxa.Api.Features.Routes;

[ApiController]
[Route("api/[controller]")]
public class RoutesController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<OffsetPaginatedList<RouteDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new GetAllRoutesQuery(page, pageSize));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error.Message);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RouteDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetRouteByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("gym/{gymId:guid}")]
    public async Task<ActionResult<OffsetPaginatedList<RouteDto>>> GetByGym(Guid gymId, [FromQuery] RouteFilter filter)
    {
        filter.GymId = gymId;
        var result = await mediator.Send(new GetRoutesByGymQuery(filter));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error.Message);
    }

    [HttpPost]
    [Authorize(Policy = "RequireRoutesetter")]
    public async Task<ActionResult<RouteDto>> Create(CreateRouteCommand command)
    {
        command = command with { AuthorId = currentUser.GetUserId() };
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value)
            : BadRequest(result.Error.Message);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireRoutesetter")]
    public async Task<IActionResult> Update(Guid id, UpdateRouteCommand command)
    {
        var result = await mediator.Send(command with {Id = id});
        return result.IsSuccess ? NoContent() : NotFound();
    }

    [HttpPatch("{id:guid}/deactivate")]
    [Authorize(Policy = "RequireRoutesetter")]
    public async Task<IActionResult> Deactivate(Guid id)
    {
        var result = await mediator.Send(new DeactivateRouteCommand(id));
        return result.IsSuccess ? NoContent() : NotFound();
    }

    [HttpPatch("{id:guid}/reactivate")]
    [Authorize(Policy = "RequireRoutesetter")]
    public async Task<IActionResult> Reactivate(Guid id)
    {
        var result = await mediator.Send(new ReactivateRouteCommand(id));
        return result.IsSuccess ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await mediator.Send(new DeleteRouteCommand(id));
        return result.IsSuccess ? NoContent() : NotFound();
    }

    /// <summary>
    /// Save feedback (rating, review, notes, grade opinion) for a route. Upsert per user.
    /// </summary>
    [HttpPut("{id:guid}/feedback")]
    [Authorize]
    public async Task<IActionResult> SaveFeedback(Guid id, [FromBody] SaveRouteFeedbackCommand body)
    {
        var cmd = body with { RouteId = id, UserId = currentUser.GetRequiredUserId() };
        var result = await mediator.Send(cmd);
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>
    /// Get grade consensus distribution for a route.
    /// </summary>
    [HttpGet("{id:guid}/consensus")]
    [Authorize]
    public async Task<ActionResult<GradeConsensusDto>> GetConsensus(Guid id)
    {
        var userId = currentUser.GetUserId();
        var result = await mediator.Send(new GetGradeConsensusQuery(id, userId));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }
}
