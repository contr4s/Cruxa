using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Common.Models;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Ascents.DTOs;

namespace Cruxa.Api.Features.Ascents;

[ApiController]
[Route("api/posts/{postId:guid}/ascents")]
[Authorize]
public class AscentsController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    /// <summary>Get all ascents for a post</summary>
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<OffsetPaginatedList<AscentDto>>> GetByPost(Guid postId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new GetAscentsByPostQuery(postId, page, pageSize));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Add an ascent to a post</summary>
    [HttpPost]
    public async Task<ActionResult<AscentDto>> Add(Guid postId, [FromBody] AddAscentCommand command)
    {
        var cmd = command with { PostId = postId, UserId = currentUser.GetRequiredUserId() };
        var result = await mediator.Send(cmd);
        return result.IsSuccess ? Created(string.Empty, result.Value) : BadRequest(result.Error);
    }

    /// <summary>Update an ascent (style, media)</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AscentDto>> Update(Guid postId, Guid id, [FromBody] UpdateAscentCommand command)
    {
        var cmd = command with { Id = id, UserId = currentUser.GetRequiredUserId() };
        var result = await mediator.Send(cmd);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Remove an ascent</summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Remove(Guid postId, Guid id)
    {
        var result = await mediator.Send(new RemoveAscentCommand(id, currentUser.GetRequiredUserId()));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}


