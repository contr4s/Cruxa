using MediatR;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Ascents.DTOs;

namespace Cruxa.Api.Features.Routes;

[ApiController]
[Route("api/routes/tags")]
public class TagsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<TagDto>>> GetAll()
    {
        var result = await mediator.Send(new GetAllTagsQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error.Message);
    }
}
