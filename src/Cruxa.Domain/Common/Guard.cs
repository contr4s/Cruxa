namespace Cruxa.Domain.Common;

/// <summary>
/// Guard clauses for validating inputs
/// </summary>
public static class Guard
{
    public static void AgainstNull(object? value, string paramName)
    {
        if (value is null)
            throw new ArgumentNullException(paramName, $"{paramName} cannot be null");
    }

    public static void AgainstNullOrEmpty(string? value, string paramName)
    {
        if (string.IsNullOrEmpty(value))
            throw new ArgumentException($"{paramName} cannot be null or empty", paramName);
    }

    public static void AgainstNullOrWhiteSpace(string? value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException($"{paramName} cannot be null or whitespace", paramName);
    }

    public static void AgainstOutOfRange(int value, int min, int max, string paramName)
    {
        if (value < min || value > max)
            throw new ArgumentOutOfRangeException(paramName, $"{paramName} must be between {min} and {max}");
    }

    public static void AgainstOutOfRange(double value, double min, double max, string paramName)
    {
        if (value < min || value > max)
            throw new ArgumentOutOfRangeException(paramName, $"{paramName} must be between {min} and {max}");
    }

    public static void AgainstDefault(Guid value, string paramName)
    {
        if (value == Guid.Empty)
            throw new ArgumentException($"{paramName} cannot be empty GUID", paramName);
    }

    public static void Against<T>(bool condition, string message) where T : Exception, new()
    {
        if (condition)
            throw new T();
    }
}
