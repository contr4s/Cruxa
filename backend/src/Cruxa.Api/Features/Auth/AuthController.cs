using MediatR;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Auth.Commands;
using Microsoft.AspNetCore.Authorization;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Domain.Entities;

namespace Cruxa.Api.Features.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IMediator mediator, ICurrentUserService currentUser) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterCommand command)
    {
        var result = await mediator.Send(command);
        if (result.IsFailure)
            return result.Error.Code switch
            {
                "Conflict" => Conflict(new { message = result.Error.Message }),
                _ => BadRequest(new { message = result.Error.Message })
            };
        await SetRefreshCookieAsync(result.Value.User.Id);
        return Ok(result.Value);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginCommand command)
    {
        var result = await mediator.Send(command);
        if (result.IsFailure)
            return Unauthorized(new { message = result.Error.Message });
        await SetRefreshCookieAsync(result.Value.User.Id);
        return Ok(result.Value);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh()
    {
        var rawToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(rawToken))
            return Unauthorized(new { message = "Refresh token not found" });
        // Cookie value may be URL-encoded by Response.Cookies.Append; decode it
        var token = Uri.UnescapeDataString(rawToken);
        var result = await mediator.Send(new RefreshTokenCommand(token));
        if (result.IsFailure)
            return Unauthorized(new { message = result.Error.Message });
        await SetRefreshCookieAsync(result.Value.User.Id);
        return Ok(result.Value);
    }

    [Authorize]
    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = currentUser.GetRequiredUserId();
        var result = await mediator.Send(new ChangePasswordCommand(userId, request.CurrentPassword, request.NewPassword));
        if (result.IsFailure)
            return BadRequest(new { message = result.Error.Message });
        return Ok();
    }

    private async Task SetRefreshCookieAsync(Guid userId)
    {
        var repo = HttpContext.RequestServices.GetRequiredService<IRefreshTokenRepository>();
        var rt = await repo.GetActiveByUserIdAsync(userId);
        if (rt is null) return;
        Response.Cookies.Append("refresh_token", rt.Token, new CookieOptions
        {
            HttpOnly = true, Secure = false, SameSite = SameSiteMode.Strict,
            Path = "/", Expires = rt.ExpiresAt
        });
    }
}


public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
