using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Ascents.DTOs;

namespace Cruxa.Api.Features.Ascents;

/// <summary>
/// Controller for user-wide ascent queries
/// </summary>
[ApiController]
[Route("api/ascents")]
[Authorize]
public class AscentsUserController(IMediator mediator) : ControllerBase
{
    /// <summary>Get all ascents for a user</summary>
    [AllowAnonymous]
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<OffsetPaginatedList<AscentDto>>> GetByUser(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new GetAscentsByUserQuery(userId, page, pageSize));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }
}
