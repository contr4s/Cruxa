using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cruxa.Infrastructure.Persistence;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Contracts;
using Cruxa.Seeder.Services;

namespace Cruxa.Api.Features.Dev;

[ApiController]
[Route("api/dev")]
[ApiExplorerSettings(IgnoreApi = true)]
public class DevController : ControllerBase
{
    private readonly CruxaDbContext _db;
    private readonly IJwtTokenGenerator _jwt;
    private readonly IWebHostEnvironment _env;

    public DevController(CruxaDbContext db, IJwtTokenGenerator jwt, IWebHostEnvironment env)
    {
        _db = db;
        _jwt = jwt;
        _env = env;
    }

    // ponytail: allow dev endpoints in production with ENABLE_SEED=true (one-time seeding)
    private bool IsDevAllowed() =>
        _env.IsEnvironment("Development") ||
        _env.IsEnvironment("Testing") ||
        (_env.IsProduction() && !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ENABLE_SEED")));

    /// <summary>
    /// Returns all seed accounts grouped by role, with gym name for staff.
    /// </summary>
    [HttpGet("accounts")]
    public async Task<ActionResult<List<DevAccountDto>>> GetAccounts()
    {
        if (!IsDevAllowed()) return NotFound();
        var allUsers = await _db.Users.ToListAsync();
        var users = allUsers.Where(u => u.Email.Value.EndsWith("@cruxa.seed")).ToList();

        var gymAssignments = await _db.GymAssignments
            .Include(ga => ga.Gym)
            .ToListAsync();

        var result = users.Select(u =>
        {
            var ga = gymAssignments.Where(x => x.UserId == u.Id).ToList();
            var gymNames = ga.Select(x => x.Gym.Name).Distinct().ToList();
            return new DevAccountDto
            {
                Id = u.Id,
                Email = u.Email.Value,
                Username = u.Username,
                DisplayName = $"{u.FirstName} {u.LastName}".Trim(),
                Role = u.Role.ToString(),
                GymNames = gymNames.Count > 0 ? gymNames : null,
            };
        }).OrderBy(a => a.Role).ThenBy(a => a.Username).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Returns a JWT for any seed user by ID (no password required, dev only).
    /// </summary>
    [HttpGet("login/{id:guid}")]
    public async Task<ActionResult> LoginById(Guid id)
    {
        if (!IsDevAllowed()) return NotFound();
        var user = await _db.Users.FindAsync(id);
        if (user is null)
            return NotFound(new { error = "User not found" });

        var token = await _jwt.GenerateAccessTokenAsync(user);
        return Ok(new { token, user = MapUser(user) });
    }

    /// <summary>
    /// Seed all test data (admin only, requires ENABLE_SEED=true).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("seed")]
    public async Task<ActionResult> Seed()
    {
        if (!IsDevAllowed()) return NotFound();
        var seeder = HttpContext.RequestServices.GetRequiredService<SeedService>();
        await seeder.SeedAsync();
        return Ok(new { message = "Seed completed" });
    }

    /// <summary>
    /// Clear all seed data (admin only, requires ENABLE_SEED=true).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("clear")]
    public async Task<ActionResult> Clear()
    {
        if (!IsDevAllowed()) return NotFound();
        var seeder = HttpContext.RequestServices.GetRequiredService<SeedService>();
        await seeder.ClearAsync();
        return Ok(new { message = "Clear completed" });
    }

    private static object MapUser(Domain.Entities.User u) => new
    {
        id = u.Id,
        username = u.Username,
        email = u.Email.Value,
        firstName = u.FirstName,
        lastName = u.LastName,
        displayName = $"{u.FirstName} {u.LastName}".Trim(),
        avatarUrl = u.AvatarUrl,
        city = u.City,
        gender = u.Gender,
        height = u.Height,
        role = u.Role.ToString(),
    };
}

public class DevAccountDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public List<string>? GymNames { get; set; }
}
