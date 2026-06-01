using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Interfaces;
using Cruxa.Application.DTOs;

namespace Cruxa.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse?>> Login(LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _authService.LoginAsync(request);
        if (result == null)
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(result);
    }
}
