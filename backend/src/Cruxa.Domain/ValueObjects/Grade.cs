namespace Cruxa.Domain.ValueObjects;

using Common;

/// <summary>
/// Grade value object (Raw representation + Normalized Index)
/// </summary>
public sealed record Grade
{
    public string Raw { get; }
    public int Index { get; }

    internal Grade(string raw, int index)
    {
        Raw = raw;
        Index = index;
    }

    public static Result<Grade> Create(string raw, int index)
    {
        Guard.AgainstNullOrWhiteSpace(raw, nameof(raw));
        Guard.AgainstOutOfRange(index, 0, 1000, nameof(index));
        return Result.Success(new Grade(raw, index));
    }

    public Grade WithIndex(int index) => new(Raw, index);
    public override string ToString() => Raw;
}
