namespace Cruxa.Domain.Common;

/// <summary>
/// Represents a domain error with code and message
/// </summary>
public sealed record Error(string Code, string Message)
{
    public static readonly Error None = new("None", string.Empty);

    public static Error NotFound(string entity, params object[] args)
        => new("NotFound", $"{entity} not found. Args: {string.Join(", ", args)}");

    public static Error Conflict(string message)
        => new("Conflict", message);

    public static Error Validation(string message)
        => new("Validation", message);

    public static Error Unauthorized(string message = "Unauthorized")
        => new("Unauthorized", message);

    public static Error Duplicate => new("Duplicate", "Duplicate resource");

    public override string ToString() => $"[{Code}] {Message}";
}
