using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;

namespace Cruxa.Api.Features.Posts;

[ApiController]
[Route("api/posts")]
[Authorize]
public class PostsController(IMediator mediator) : ControllerBase
{
    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>Get post by ID</summary>
    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PostDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetPostByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Get posts by user ID</summary>
    [AllowAnonymous]
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetByUser(Guid userId)
    {
        var result = await mediator.Send(new GetPostsByUserQuery(userId));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Get feed (posts from followed users + own)</summary>
    [HttpGet("feed")]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        var result = await mediator.Send(new GetFeedQuery(userId, page, pageSize));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Get posts by gym</summary>
    [AllowAnonymous]
    [HttpGet("gym/{gymId:guid}")]
    public async Task<ActionResult<IEnumerable<PostDto>>> GetByGym(Guid gymId)
    {
        var result = await mediator.Send(new GetPostsByGymQuery(gymId));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Create a new post (draft)</summary>
    [HttpPost]
    public async Task<ActionResult<PostDto>> Create([FromBody] CreatePostRequest request)
    {
        var userId = GetUserId();
        var command = new CreatePostCommand(
            userId, request.GymId, request.Description,
            request.MediaUrls, request.Visibility);
        var result = await mediator.Send(command);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value.Id }, result.Value)
            : BadRequest(result.Error);
    }

    /// <summary>Update post</summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PostDto>> Update(Guid id, [FromBody] CreatePostRequest request)
    {
        var userId = GetUserId();
        var command = new UpdatePostCommand(
            id, userId, request.Description,
            request.MediaUrls, request.Visibility);
        var result = await mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Publish a draft post</summary>
    [HttpPut("{id:guid}/publish")]
    public async Task<ActionResult> Publish(Guid id)
    {
        var userId = GetUserId();
        var result = await mediator.Send(new PublishPostCommand(id, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Delete post</summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var result = await mediator.Send(new DeletePostCommand(id, userId));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
