namespace Cruxa.Parser.Services;

using Domain.ValueObjects;

/// <summary>
/// Helper for compact representation of working hours.
/// Groups consecutive days with the same hours into entries like "Пн-Пт: с 8:00 до 23:00".
/// </summary>
public static class WorkingHoursHelper
{
    private static readonly string[] DayNames =
        ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

    private static readonly string[] DayShort =
        ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    /// <summary>
    /// Converts a dictionary of day → hours into a list of validated entries.
    /// </summary>
    public static List<WorkingHoursEntry>? ToEntries(Dictionary<string, string>? workingHours)
    {
        if (workingHours is null || workingHours.Count == 0)
            return null;

        var ordered = DayNames
            .Select((name, i) => (Index: i, Hours: workingHours.GetValueOrDefault(name, string.Empty)))
            .Where(x => !string.IsNullOrWhiteSpace(x.Hours))
            .ToList();

        if (ordered.Count == 0)
            return null;

        // All same hours on ALL 7 days → single "Ежедневно" entry
        var distinctHours = ordered.Select(x => x.Hours).Distinct().ToList();
        if (distinctHours.Count == 1 && ordered.Count == 7)
        {
            var parsed = ParseHours(distinctHours[0]);
            if (parsed is null) return null;
            var entry = WorkingHoursEntry.Create("Ежедневно", parsed.Value.From, parsed.Value.To);
            return entry.IsSuccess ? [entry.Value!] : null;
        }

        // Group consecutive days with same hours
        var groups = new List<(int Start, int End, string Hours)>();
        var currentStart = ordered[0].Index;
        var currentHours = ordered[0].Hours;

        for (var i = 1; i < ordered.Count; i++)
        {
            if (ordered[i].Hours == currentHours && ordered[i].Index == ordered[i - 1].Index + 1)
                continue;

            groups.Add((currentStart, ordered[i - 1].Index, currentHours));
            currentStart = ordered[i].Index;
            currentHours = ordered[i].Hours;
        }

        groups.Add((currentStart, ordered[^1].Index, currentHours));

        // Format groups into validated entries
        var entries = new List<WorkingHoursEntry>();
        foreach (var g in groups)
        {
            var range = g.Start == g.End
                ? DayShort[g.Start]
                : $"{DayShort[g.Start]}-{DayShort[g.End]}";

            var parsed = ParseHours(g.Hours);
            if (parsed is null) continue;

            var result = WorkingHoursEntry.Create(range, parsed.Value.From, parsed.Value.To);
            if (result.IsSuccess)
                entries.Add(result.Value!);
        }

        return entries.Count > 0 ? entries : null;
    }

    /// <summary>
    /// Parses a hours string like "с 8:00 до 23:00" into TimeOnly components.
    /// </summary>
    private static (TimeOnly From, TimeOnly To)? ParseHours(string hours)
    {
        const string prefix = "с ";
        var dashIndex = hours.IndexOf(" до ", StringComparison.Ordinal);
        if (!hours.StartsWith(prefix, StringComparison.Ordinal) || dashIndex < 0)
            return null;

        var fromStr = hours[prefix.Length..dashIndex].Trim();
        var toStr = hours[(dashIndex + 4)..].Trim();

        if (!TimeOnly.TryParse(fromStr, out var from) ||
            !TimeOnly.TryParse(toStr, out var to))
            return null;

        return (from, to);
    }
}
