using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Users.DTOs;
using Cruxa.Application.Features.Users.Queries;
using Cruxa.Application.Features.Users.Commands;

namespace Cruxa.Api.Features.Users;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto>> GetById(Guid id)
    {
        var result = await mediator.Send(new GetUserByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("username/{username}")]
    public async Task<ActionResult<UserDto>> GetByUsername(string username)
    {
        var result = await mediator.Send(new GetUserByUsernameQuery(username));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var result = await mediator.Send(new GetAllUsersQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest();
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<UserDto>> Update(Guid id, UpdateUserCommand command)
    {
        var result = await mediator.Send(command with { Id = id, CurrentUserId = currentUser.GetRequiredUserId() });
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await mediator.Send(new DeleteUserCommand(id));
        return NoContent();
    }

}

