namespace Cruxa.Domain.ValueObjects;

/// <summary>
/// A named price entry (e.g., "Разовое посещение" → "от 350 руб")
/// </summary>
public class PriceItem
{
    public string Name { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
}
