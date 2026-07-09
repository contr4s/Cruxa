using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Enums;

namespace Cruxa.Api.Features.Gyms;

[ApiController]
[Route("api/[controller]")]
public class GymsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<OffsetPaginatedList<GymDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? city = null, [FromQuery] string? sort = null)
    {
        var sortEnum = Enum.TryParse<GymSort>(sort, ignoreCase: true, out var parsed) ? parsed : (GymSort?)null;
        var result = await mediator.Send(new GetAllGymsQuery(page, pageSize, city, sortEnum));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error.Message);
    }

    [HttpGet("cities")]
    public async Task<ActionResult<List<string>>> GetCities()
    {
        var result = await mediator.Send(new GetCitiesQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error.Message);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GymDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetGymByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpPost]
    [Authorize(Policy = "RequireGymAdmin")]
    public async Task<ActionResult<GymDto>> Create(CreateGymCommand command)
    {
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value)
            : BadRequest(result.Error.Message);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireGymAdmin")]
    public async Task<ActionResult<GymDto>> Update(Guid id, CreateGymCommand command)
    {
        var result = await mediator.Send(new UpdateGymCommand(id, command.Name, command.City, command.Address,
            command.Latitude, command.Longitude, command.Description, command.ContactInfo, command.Website,
            command.Prices, command.WorkingHours, command.PhotoUrls, command.GradingSystemId));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await mediator.Send(new DeleteGymCommand(id));
        return result.IsSuccess ? NoContent() : NotFound();
    }

    /// <summary>
    /// Clear all gyms from the database. Admin-only.
    /// </summary>
    [HttpDelete("clear")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Clear()
    {
        await mediator.Send(new ClearGymsCommand());
        return NoContent();
    }

    /// <summary>
    /// Bulk import gyms from an external parser source.
    /// Admin-only. Validates and deduplicates each gym.
    /// </summary>
    [HttpPost("import")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<ActionResult<BulkImportResult>> BulkImport(BulkImportGymsCommand command)
    {
        var result = await mediator.Send(command);
        if (result.IsFailure)
            return BadRequest(result.Error.Message);

        return Ok(result.Value);
    }
}
