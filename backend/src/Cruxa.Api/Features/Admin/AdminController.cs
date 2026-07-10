using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Application.Features.Admin.Queries;
using Cruxa.Application.Common.Models;

namespace Cruxa.Api.Features.Admin;

[ApiController]
[Route("api/admin")]
[Authorize(Policy = "RequireAdmin")]
public class AdminController(IMediator mediator) : ControllerBase
{
    /// <summary>
    /// Returns global platform statistics.
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<AdminDashboardStatsDto>> GetStats()
    {
        var result = await mediator.Send(new GetAdminStatsQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>
    /// Returns recent activity across the platform.
    /// </summary>
    [HttpGet("recent-activity")]
    public async Task<ActionResult<List<RecentActivityItemDto>>> GetRecentActivity()
    {
        var result = await mediator.Send(new GetRecentActivityQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>
    /// Returns top gyms by ascents count.
    /// </summary>
    [HttpGet("top-gyms")]
    public async Task<ActionResult<List<TopGymItemDto>>> GetTopGyms()
    {
        var result = await mediator.Send(new GetTopGymsQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>
    /// Returns paginated list of all gyms with admin-level data.
    /// </summary>
    [HttpGet("gyms")]
    public async Task<ActionResult<OffsetPaginatedList<AdminGymItemDto>>> GetGyms(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? city = null,
        [FromQuery] string? status = null,
        [FromQuery] string? sort = null)
    {
        var result = await mediator.Send(new GetAdminGymsQuery(page, pageSize, city, status, sort));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }
}
