using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Interfaces;
using Cruxa.Application.DTOs;
using System.Security.Claims;

namespace Cruxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly IRouteService _routeService;

    public RoutesController(IRouteService routeService)
    {
        _routeService = routeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RouteDto>>> GetAll()
    {
        var routes = await _routeService.GetAllAsync();
        return Ok(routes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RouteDto?>> GetById(Guid id)
    {
        var route = await _routeService.GetByIdAsync(id);
        if (route == null)
            return NotFound();
        return Ok(route);
    }

    [HttpGet("gym/{gymId:guid}")]
    public async Task<ActionResult<IEnumerable<RouteDto>>> GetByGym(Guid gymId)
    {
        var routes = await _routeService.GetByGymAsync(gymId);
        return Ok(routes);
    }

    [HttpPost]
    [Authorize(Policy = "RequireRoutesetter")]
    public async Task<ActionResult<RouteDto>> Create(CreateRouteRequest request)
    {
        var authorId = GetCurrentUserId();
        var route = await _routeService.CreateAsync(request, authorId);
        return CreatedAtAction(nameof(GetById), new { id = route.Id }, route);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireRoutesetter")]
    public async Task<IActionResult> Update(Guid id, UpdateRouteRequest request)
    {
        var result = await _routeService.UpdateAsync(id, request);
        if (!result)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireGymAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _routeService.DeleteAsync(id);
        if (!result)
            return NotFound();
        return NoContent();
    }

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        return userIdClaim != null ? Guid.Parse(userIdClaim) : null;
    }
}
