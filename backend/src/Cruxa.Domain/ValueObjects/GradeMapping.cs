namespace Cruxa.Domain.ValueObjects;

using Common;

/// <summary>
/// GradeMapping value object - dictionary mapping raw grade string to normalized index
/// </summary>
public sealed class GradeMapping : IEquatable<GradeMapping>
{
    private readonly Dictionary<string, int> _map;

    private GradeMapping(Dictionary<string, int> map)
    {
        _map = new Dictionary<string, int>(map, StringComparer.OrdinalIgnoreCase);
    }

    public static Result<GradeMapping> Create(Dictionary<string, int> map)
    {
        Guard.AgainstNull(map, nameof(map));
        if (map.Count == 0)
            return Error.Validation("Grade mapping cannot be empty");
        if (map.Values.Any(v => v is < 0 or > 1000))
            return Error.Validation("All grade indices must be between 0 and 1000");

        return Result.Success(new GradeMapping(map));
    }

    public Result<int> ResolveIndex(string raw)
    {
        Guard.AgainstNullOrWhiteSpace(raw, nameof(raw));
        if (_map.TryGetValue(raw, out var index))
            return Result.Success(index);
        return Result.Failure<int>(Error.Validation($"Grade '{raw}' not found in mapping"));
    }

    public Result<Grade> ResolveGrade(string raw)
    {
        var indexResult = ResolveIndex(raw);
        if (indexResult.IsFailure)
            return Result.Failure<Grade>(indexResult.Error);
        return Grade.Create(raw, indexResult.Value);
    }

    /// <summary>
    /// Reverse lookup — finds the grade string closest to the given index.
    /// </summary>
    public Result<Grade> ResolveGrade(int index)
    {
        if (_map.Count == 0)
            return Result.Failure<Grade>(Error.Validation("Grade mapping is empty"));

        var closest = _map
            .OrderBy(kv => Math.Abs(kv.Value - index))
            .ThenBy(kv => kv.Value < index ? 0 : 1) // prefer lower grade on tie
            .First();

        return Grade.Create(closest.Key, closest.Value);
    }

    public IReadOnlyDictionary<string, int> Mapping => _map;

    public override string ToString() => $"{{ {string.Join(", ", _map.OrderBy(kv => kv.Key).Select(kv => $"{kv.Key}={kv.Value}"))} }}";

    public bool Equals(GradeMapping? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        if (_map.Count != other._map.Count) return false;
        return _map.OrderBy(kv => kv.Key)
            .SequenceEqual(other._map.OrderBy(kv => kv.Key));
    }

    public override bool Equals(object? obj) => obj is GradeMapping other && Equals(other);

    public override int GetHashCode()
    {
        var hash = new HashCode();
        foreach (var kv in _map.OrderBy(kv => kv.Key))
        {
            hash.Add(kv.Key, StringComparer.OrdinalIgnoreCase);
            hash.Add(kv.Value);
        }
        return hash.ToHashCode();
    }

    public static bool operator ==(GradeMapping left, GradeMapping right) => left?.Equals(right) ?? right is null;
    public static bool operator !=(GradeMapping left, GradeMapping right) => !(left == right);
}
