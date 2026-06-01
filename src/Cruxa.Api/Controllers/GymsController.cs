using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Interfaces;
using Cruxa.Application.DTOs;

namespace Cruxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GymsController : ControllerBase
{
    private readonly IGymService _gymService;

    public GymsController(IGymService gymService)
    {
        _gymService = gymService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GymDto>>> GetAll()
    {
        var gyms = await _gymService.GetAllAsync();
        return Ok(gyms);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GymDto?>> GetById(Guid id)
    {
        var gym = await _gymService.GetByIdAsync(id);
        if (gym == null)
            return NotFound();
        return Ok(gym);
    }

    [HttpGet("city/{city}")]
    public async Task<ActionResult<IEnumerable<GymDto>>> GetByCity(string city)
    {
        var gyms = await _gymService.GetByCityAsync(city);
        return Ok(gyms);
    }

    [HttpPost]
    [Authorize(Policy = "RequireGymAdmin")]
    public async Task<ActionResult<GymDto>> Create(CreateGymRequest request)
    {
        var gym = await _gymService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = gym.Id }, gym);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireGymAdmin")]
    public async Task<ActionResult<GymDto?>> Update(Guid id, CreateGymRequest request)
    {
        var gym = await _gymService.UpdateAsync(id, request);
        if (gym == null)
            return NotFound();
        return Ok(gym);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _gymService.DeleteAsync(id);
        if (!result)
            return NotFound();
        return NoContent();
    }
}
