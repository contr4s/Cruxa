using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Application.Features.Gyms.Queries;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Application.Common.Models;

namespace Cruxa.Api.Features.Gyms;

[ApiController]
[Route("api/[controller]")]
public class GymsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<OffsetPaginatedList<GymDto>>> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new GetAllGymsQuery(page, pageSize));
        return Ok(result.Value);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GymDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetGymByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("city/{city}")]
    public async Task<ActionResult<OffsetPaginatedList<GymDto>>> GetByCity(string city, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new GetGymsByCityQuery(city, page, pageSize));
        return Ok(result.Value);
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
}
