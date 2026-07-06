using MediatR;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Routes.Queries;

namespace Cruxa.Api.Features.Routes;

[ApiController]
[Route("api/routes/[controller]")]
public class TagsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<string>>> GetAll()
    {
        var result = await mediator.Send(new GetAllTagsQuery());
        return Ok(result.Value);
    }
}
