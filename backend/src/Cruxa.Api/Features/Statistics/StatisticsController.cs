using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Queries;

namespace Cruxa.Api.Features.Statistics;

[ApiController]
[Route("api")]
[Authorize]
public class StatisticsController(IMediator mediator) : ControllerBase
{
    [HttpGet("users/{id:guid}/stats")]
    public async Task<ActionResult<UserStatsDto>> GetUserStats(Guid id)
    {
        var result = await mediator.Send(new GetUserStatsQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("users/{id:guid}/kruscore-history")]
    public async Task<ActionResult<List<KruscorePointDto>>> GetKruscoreHistory(
        Guid id, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null)
    {
        from ??= DateTime.MinValue;
        to ??= DateTime.MaxValue;
        var result = await mediator.Send(new GetKruscoreHistoryQuery(id, from, to));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("users/{id:guid}/grade-pyramid")]
    public async Task<ActionResult<List<GradePyramidItemDto>>> GetGradePyramid(Guid id)
    {
        var result = await mediator.Send(new GetGradePyramidQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("users/{id:guid}/ascent-distribution")]
    public async Task<ActionResult<List<AscentDistributionDto>>> GetAscentDistribution(Guid id)
    {
        var result = await mediator.Send(new GetAscentDistributionQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("users/{id:guid}/top-routes")]
    public async Task<ActionResult<TopRoutesResponseDto>> GetTopRoutes(Guid id)
    {
        var result = await mediator.Send(new GetTopRoutesQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("users/{id:guid}/monthly-activity")]
    public async Task<ActionResult<MonthlyActivityDto>> GetMonthlyActivity(
        Guid id, [FromQuery] int? year = null, [FromQuery] int? month = null)
    {
        var now = DateTime.UtcNow;
        year ??= now.Year;
        month ??= now.Month;
        var result = await mediator.Send(new GetMonthlyActivityQuery(id, year.Value, month.Value));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("users/{id:guid}/radar-skills")]
    public async Task<ActionResult<RadarSkillsResponse>> GetRadarSkills(Guid id)
    {
        var result = await mediator.Send(new GetRadarSkillsQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("gyms/{id:guid}/stats")]
    public async Task<ActionResult<GymStatsDto>> GetGymStats(Guid id)
    {
        var result = await mediator.Send(new GetGymStatsQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }

    [HttpGet("routes/{id:guid}/stats")]
    public async Task<ActionResult<RouteStatsDto>> GetRouteStats(Guid id)
    {
        var result = await mediator.Send(new GetRouteStatsQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound();
    }
}
