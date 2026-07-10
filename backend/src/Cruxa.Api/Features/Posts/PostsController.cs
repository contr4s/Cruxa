using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Enums;
using Cruxa.Application.Features.Posts.Commands;
using Cruxa.Application.Features.Posts.Queries;
using Cruxa.Application.Features.Posts.DTOs;

namespace Cruxa.Api.Features.Posts;

[ApiController]
[Route("api/posts")]
[Authorize]
public class PostsController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    /// <summary>Get post by ID</summary>
    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PostDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetPostByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Get current user's draft post (if any)</summary>
    [HttpGet("my-draft")]
    public async Task<ActionResult<PostDto?>> GetMyDraft()
    {
        var result = await mediator.Send(new GetMyDraftQuery(currentUser.GetRequiredUserId()));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Get posts by user ID</summary>
    [AllowAnonymous]
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<OffsetPaginatedList<PostDto>>> GetByUser(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var currentUserId = currentUser.GetUserId();
        var result = await mediator.Send(new GetPostsByUserQuery(userId, currentUserId, page, pageSize));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Get feed (posts from followed users + own)</summary>
    [HttpGet("feed")]
    public async Task<ActionResult<OffsetPaginatedList<PostDto>>> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] FeedFilter? filter = null)
    {
        var result = await mediator.Send(new GetFeedQuery(currentUser.GetRequiredUserId(), page, pageSize, filter));
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
        var command = new CreatePostCommand(
            currentUser.GetRequiredUserId(), request.GymId, request.Description,
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
        var command = new UpdatePostCommand(
            id, currentUser.GetRequiredUserId(), request.Description,
            request.MediaUrls, request.Visibility, request.Duration, Status: request.Status);
        var result = await mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
    }

    /// <summary>Publish a draft post</summary>
    [HttpPut("{id:guid}/publish")]
    public async Task<ActionResult> Publish(Guid id, [FromBody] PublishPostRequest? body)
    {
        var result = await mediator.Send(new PublishPostCommand(id, currentUser.GetRequiredUserId(), body?.SelectedMediaUrls));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }

    /// <summary>Delete post</summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await mediator.Send(new DeletePostCommand(id, currentUser.GetRequiredUserId()));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
