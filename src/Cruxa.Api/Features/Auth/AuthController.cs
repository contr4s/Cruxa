using MediatR;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Auth.DTOs;
using Cruxa.Application.Features.Auth.Commands;
using Cruxa.Application.Features.Auth.Queries;

namespace Cruxa.Api.Features.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterCommand command)
    {
        var result = await _mediator.Send(command);

        if (result.IsFailure)
            return result.Error.Code switch
            {
                "Conflict" => Conflict(new { message = result.Error.Message }),
                "Validation" => BadRequest(new { message = result.Error.Message }),
                _ => BadRequest(new { message = result.Error.Message })
            };

        return Ok(result.Value);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginQuery query)
    {
        var result = await _mediator.Send(query);

        if (result.IsFailure)
            return Unauthorized(new { message = result.Error.Message });

        return Ok(result.Value);
    }
}
