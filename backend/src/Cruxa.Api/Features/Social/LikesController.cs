using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Social.Commands;

namespace Cruxa.Api.Features.Social;

[ApiController]
[Authorize]
[Route("api/posts")]
public class LikesController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    /// <summary>Like a post</summary>
    [HttpPost("{postId:guid}/like")]
    public async Task<ActionResult> LikePost(Guid postId)
    {
        var result = await mediator.Send(new LikePostCommand(postId, currentUser.GetRequiredUserId()));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Unlike a post</summary>
    [HttpDelete("{postId:guid}/unlike")]
    public async Task<ActionResult> UnlikePost(Guid postId)
    {
        var result = await mediator.Send(new UnlikePostCommand(postId, currentUser.GetRequiredUserId()));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
