using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.Routes.Handlers;

internal static class TagHelpers
{
    public static async Task<Result<List<Tag>>> ValidateAndResolveTagsAsync(
        List<string> rawTags,
        ITagRepository tagRepo)
    {
        var validated = new List<string>(rawTags.Count);
        foreach (var raw in rawTags)
        {
            var tagResult = Tag.Create(raw);
            if (tagResult.IsFailure)
                return Result.Failure<List<Tag>>(tagResult.Error);
            validated.Add(tagResult.Value.Value);
        }

        var unique = validated.Distinct().ToList();
        var tags = await tagRepo.GetOrCreateTagsAsync(unique);
        return Result.Success(tags);
    }
}
