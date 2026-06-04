using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Interfaces;
using Cruxa.Application.Features.Social.Commands;
using Cruxa.Application.Features.Social.Queries;

namespace Cruxa.Api.Features.Social;

[ApiController]
[Authorize]
[Route("api/posts")]
public class CommentsController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    /// <summary>Get comments for a post</summary>
    [AllowAnonymous]
    [HttpGet("{postId:guid}/comments")]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(Guid postId)
    {
        var result = await mediator.Send(new GetCommentsByPostQuery(postId));
        return result.IsSuccess ? Ok(result.Value) : NotFound(result.Error);
    }

    /// <summary>Add a comment to a post</summary>
    [HttpPost("{postId:guid}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid postId, [FromBody] AddCommentCommand command)
    {
        var cmd = command with { PostId = postId, UserId = currentUser.GetRequiredUserId() };
        var result = await mediator.Send(cmd);
        return result.IsSuccess ? CreatedAtAction(nameof(GetComments), new { postId }, result.Value) : BadRequest(result.Error);
    }

    /// <summary>Delete a comment</summary>
    [HttpDelete("/api/comments/{commentId:guid}")]
    public async Task<ActionResult> DeleteComment(Guid commentId)
    {
        var result = await mediator.Send(new DeleteCommentCommand(commentId, currentUser.GetRequiredUserId()));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
