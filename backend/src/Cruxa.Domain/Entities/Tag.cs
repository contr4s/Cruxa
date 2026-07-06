namespace Cruxa.Domain.Entities;

using System.Text.RegularExpressions;
using Abstractions;
using Common;

/// <summary>
/// Tag entity — отдельная таблица tags, many-to-many с Route.
/// </summary>
public sealed partial class Tag : Entity<Guid>
{
    private static readonly Regex ValidTagPattern = ValidTagRegex();

    [GeneratedRegex(@"^[\p{L}0-9\s\-_#+]+$", RegexOptions.Compiled)]
    private static partial Regex ValidTagRegex();

    /// <summary>Normalized tag value (lowercase, trimmed)</summary>
    public string Value { get; private set; } = null!;

    /// <summary>Optional category namespace (e.g. "style", "hold", "feature")</summary>
    public string? Category { get; private set; }

    // For EF Core
    private Tag() { }

    private Tag(Guid id, string value, string? category)
    {
        Id = id;
        Value = value;
        Category = category?.ToLowerInvariant();
    }

    public static Result<Tag> Create(string raw, string? category = null)
    {
        Guard.AgainstNullOrWhiteSpace(raw, nameof(raw));

        var value = raw.Trim().ToLowerInvariant();

        if (value.Length > 50)
            return Error.Validation("Tag cannot exceed 50 characters");

        if (value.Length < 1)
            return Error.Validation("Tag cannot be empty");

        if (!ValidTagPattern.IsMatch(value))
            return Error.Validation(
                "Tag may only contain letters, digits, spaces, hyphens, underscores, # and +");

        return Result.Success(new Tag(Guid.NewGuid(), value, category));
    }

    /// <summary>
    /// Creates a Tag without validation (for reconstruction from DB).
    /// The value MUST already be normalized (lowercase, trimmed, valid).
    /// </summary>
    public static Tag CreateUnsafe(string value, string? category = null)
    {
        return new Tag(Guid.NewGuid(), value, category);
    }

    /// <summary>
    /// Creates a Tag with a specific ID without validation (for reconstruction from DB).
    /// </summary>
    public static Tag CreateUnsafe(Guid id, string value, string? category = null)
    {
        return new Tag(id, value, category);
    }

    public override string ToString() => Category is null ? Value : $"{Category}:{Value}";
}
