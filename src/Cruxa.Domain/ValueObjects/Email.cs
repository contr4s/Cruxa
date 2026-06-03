namespace Cruxa.Domain.ValueObjects;

using System.Text.RegularExpressions;
using Common;

/// <summary>
/// Email value object with validation
/// </summary>
public sealed partial record Email
{
    private static readonly Regex EmailRegex = EmailPattern();

    [GeneratedRegex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", RegexOptions.Compiled)]
    private static partial Regex EmailPattern();

    public string Value { get; }

    private Email(string value) => Value = value.ToLowerInvariant();

    public static Result<Email> Create(string value)
    {
        Guard.AgainstNullOrWhiteSpace(value, nameof(value));

        var trimmed = value.Trim().ToLowerInvariant();
        if (trimmed.Length > 320)
            return Error.Validation("Email cannot exceed 320 characters");

        if (!EmailRegex.IsMatch(trimmed))
            return Error.Validation("Invalid email format");

        return Result.Success(new Email(trimmed));
    }

    public static implicit operator string(Email email) => email.Value;
    public override string ToString() => Value;
}
