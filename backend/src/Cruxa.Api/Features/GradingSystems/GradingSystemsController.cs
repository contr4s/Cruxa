using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.GradingSystems.Queries;
using Cruxa.Application.Features.GradingSystems.Commands;
using Cruxa.Application.Features.Gyms.DTOs;

namespace Cruxa.Api.Features.GradingSystems;

[ApiController]
[Route("api/grading-systems")]
public class GradingSystemsController(IMediator mediator) : ControllerBase
{
    /// <summary>Get all grading systems</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GradingSystemDto>>> GetAll()
    {
        var result = await mediator.Send(new GetAllGradingSystemsQuery());
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Get grading system by ID</summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GradingSystemDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetGradingSystemByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Get grading system for a specific gym</summary>
    [HttpGet("gym/{gymId:guid}")]
    public async Task<ActionResult<GradingSystemDto>> GetByGymId(Guid gymId)
    {
        var result = await mediator.Send(new GetGradingSystemByGymIdQuery(gymId));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Create a new grading system</summary>
    [HttpPost]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<GradingSystemDto>> Create([FromBody] CreateGradingSystemCommand command)
    {
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value)
            : BadRequest(result.Error.Message);
    }

    /// <summary>Update a grading system</summary>
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<GradingSystemDto>> Update(Guid id, [FromBody] UpdateGradingSystemCommand command)
    {
        var result = await mediator.Send(command with { Id = id });
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error.Message);
    }

    /// <summary>Delete a grading system</summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await mediator.Send(new DeleteGradingSystemCommand(id));
        return result.IsSuccess ? NoContent() : NotFound(result.Error.Message);
    }
}
