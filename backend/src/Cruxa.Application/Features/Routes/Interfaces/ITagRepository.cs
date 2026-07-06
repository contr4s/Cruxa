using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Interfaces;

public interface ITagRepository
{
    Task<List<Tag>> GetAllTagsAsync();
    Task<List<Tag>> GetOrCreateTagsAsync(IEnumerable<string> values);
}
