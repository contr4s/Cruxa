using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Social.Commands;

namespace Cruxa.Api.Features.Social;

[ApiController]
[Authorize]
public class LikesController : ControllerBase
{
    private readonly IMediator _mediator;

    public LikesController(IMediator mediator) => _mediator = mediator;

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>Like a post</summary>
    [HttpPost("api/posts/{postId:guid}/like")]
    public async Task<ActionResult> LikePost(Guid postId)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new LikePostCommand(postId, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Unlike a post</summary>
    [HttpDelete("api/posts/{postId:guid}/unlike")]
    public async Task<ActionResult> UnlikePost(Guid postId)
    {
        var userId = GetUserId();
        var result = await _mediator.Send(new UnlikePostCommand(postId, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
