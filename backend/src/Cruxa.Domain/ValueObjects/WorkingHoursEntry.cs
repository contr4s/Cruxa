namespace Cruxa.Domain.ValueObjects;

using Common;
using System.Text.Json.Serialization;

/// <summary>
/// Represents a single working hours entry.
/// Example: { Days: "Пн-Пт", From: "8:00", To: "23:00" }
/// or { Days: "Ежедневно", From: "8:00", To: "23:00" }
/// </summary>
public class WorkingHoursEntry
{
    /// <summary>Дни недели (например "Пн-Пт", "Ежедневно", "Сб", "Вт,Чт")</summary>
    public string Days { get; set; } = string.Empty;

    /// <summary>Время открытия</summary>
    public TimeOnly From { get; set; }

    /// <summary>Время закрытия</summary>
    public TimeOnly To { get; set; }

    /// <summary>
    /// Parameterless constructor for EF Core / JSON serialization / Mapster.
    /// Do not use directly; prefer <see cref="Create"/> for manual construction.
    /// </summary>
    [JsonConstructor]
    public WorkingHoursEntry() { }

    /// <summary>
    /// Creates a validated WorkingHoursEntry.
    /// </summary>
    public static Result<WorkingHoursEntry> Create(string days, TimeOnly from, TimeOnly to)
    {
        if (string.IsNullOrWhiteSpace(days))
            return Error.Validation("Days must not be empty");

        if (from >= to)
            return Error.Validation("From time must be earlier than To time");

        return Result.Success(new WorkingHoursEntry { Days = days, From = from, To = to });
    }
}
