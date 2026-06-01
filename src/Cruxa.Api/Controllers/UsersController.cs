using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Interfaces;
using Cruxa.Application.DTOs;

namespace Cruxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto?>> GetById(Guid id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    [HttpGet("username/{username}")]
    public async Task<ActionResult<UserDto?>> GetByUsername(string username)
    {
        var user = await _userService.GetByUsernameAsync(username);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateUserRequest request)
    {
        try
        {
            var user = await _userService.UpdateAsync(id, request);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _userService.DeleteAsync(id);
        return NoContent();
    }
}
