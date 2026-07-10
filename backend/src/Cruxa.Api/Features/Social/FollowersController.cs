using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Application.Features.Social.Queries;
using Cruxa.Application.Features.Users.DTOs;

namespace Cruxa.Api.Features.Social;

[ApiController]
[Authorize]
[Route("api/users")]
public class FollowersController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    /// <summary>Follow a user</summary>
    [HttpPost("{userId:guid}/follow")]
    public async Task<ActionResult> FollowUser(Guid userId)
    {
        var result = await mediator.Send(new FollowUserCommand(currentUser.GetRequiredUserId(), userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Unfollow a user</summary>
    [HttpDelete("{userId:guid}/follow")]
    public async Task<ActionResult> UnfollowUser(Guid userId)
    {
        var result = await mediator.Send(new UnfollowUserCommand(currentUser.GetRequiredUserId(), userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Get followers of a user</summary>
    [AllowAnonymous]
    [HttpGet("{userId:guid}/followers")]
    public async Task<ActionResult<List<UserDto>>> GetFollowers(Guid userId)
    {
        var result = await mediator.Send(new GetFollowersQuery(userId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Get who a user is following</summary>
    [AllowAnonymous]
    [HttpGet("{userId:guid}/following")]
    public async Task<ActionResult<List<UserDto>>> GetFollowing(Guid userId)
    {
        var result = await mediator.Send(new GetFollowingQuery(userId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Check if current user is following a specific user</summary>
    [HttpGet("{userId:guid}/is-following")]
    public async Task<ActionResult<bool>> IsFollowing(Guid userId)
    {
        var result = await mediator.Send(new IsFollowingQuery(currentUser.GetRequiredUserId(), userId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }
}
