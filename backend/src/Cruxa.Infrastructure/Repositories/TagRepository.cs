using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Domain.Entities;
using Cruxa.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Cruxa.Infrastructure.Repositories;

public class TagRepository : ITagRepository
{
    private readonly CruxaDbContext _context;

    public TagRepository(CruxaDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tag>> GetAllTagsAsync()
    {
        return await _context.Tags
            .OrderBy(t => t.Value)
            .ToListAsync();
    }

    public async Task<List<Tag>> GetOrCreateTagsAsync(IEnumerable<string> values)
    {
        var normalized = values
            .Select(v => v.Trim().ToLowerInvariant())
            .Distinct()
            .ToList();

        var existing = await _context.Tags
            .Where(t => normalized.Contains(t.Value))
            .ToListAsync();

        var existingValues = existing.Select(t => t.Value).ToHashSet();

        var newTags = normalized
            .Where(v => !existingValues.Contains(v))
            .Select(v => Tag.Create(v).Value!)
            .ToList();

        if (newTags.Count > 0)
        {
            _context.Tags.AddRange(newTags);
        }

        return existing.Concat(newTags).ToList();
    }
}
