using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Ascents.DTOs;

namespace Cruxa.Api.Features.Ascents;

[ApiController]
[Route("api/posts/{postId:guid}/ascents")]
[Authorize]
public class AscentsController(IMediator mediator) : ControllerBase
{
    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>Get all ascents for a post</summary>
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AscentDto>>> GetByPost(Guid postId)
    {
        var result = await mediator.Send(new GetAscentsByPostQuery(postId));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Add an ascent to a post</summary>
    [HttpPost]
    public async Task<ActionResult> Add(Guid postId, [FromBody] AddAscentCommand command)
    {
        var userId = GetUserId();
        var cmd = command with { PostId = postId, UserId = userId };
        var result = await mediator.Send(cmd);
        return result.IsSuccess ? Created() : BadRequest(result.Error);
    }

    /// <summary>Remove an ascent</summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Remove(Guid postId, Guid id)
    {
        var userId = GetUserId();
        var result = await mediator.Send(new RemoveAscentCommand(id, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
