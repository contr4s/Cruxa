using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Application.Features.Social.Queries;

namespace Cruxa.Api.Features.Social;

[ApiController]
[Authorize]
public class FollowersController(IMediator mediator) : ControllerBase
{
    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>Follow a user</summary>
    [HttpPost("api/users/{userId:guid}/follow")]
    public async Task<ActionResult> FollowUser(Guid userId)
    {
        var followerId = GetUserId();
        var result = await mediator.Send(new FollowUserCommand(followerId, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Unfollow a user</summary>
    [HttpDelete("api/users/{userId:guid}/follow")]
    public async Task<ActionResult> UnfollowUser(Guid userId)
    {
        var followerId = GetUserId();
        var result = await mediator.Send(new UnfollowUserCommand(followerId, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Get followers of a user</summary>
    [AllowAnonymous]
    [HttpGet("api/users/{userId:guid}/followers")]
    public async Task<ActionResult<IEnumerable<Guid>>> GetFollowers(Guid userId)
    {
        var result = await mediator.Send(new GetFollowersQuery(userId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Get who a user is following</summary>
    [AllowAnonymous]
    [HttpGet("api/users/{userId:guid}/following")]
    public async Task<ActionResult<IEnumerable<Guid>>> GetFollowing(Guid userId)
    {
        var result = await mediator.Send(new GetFollowingQuery(userId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }
}
