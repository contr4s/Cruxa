namespace Cruxa.Application.Services;

using System.Text.Json;

public interface IGradeMappingService
{
    int CalculateGradeIndex(string gradeRaw, string gradeMappingJson);
}

public class GradeMappingService : IGradeMappingService
{
    /// <summary>
    /// Вычисляет нормализованный индекс сложности из маппинга грейдов
    /// </summary>
    public int CalculateGradeIndex(string gradeRaw, string gradeMappingJson)
    {
        if (string.IsNullOrEmpty(gradeMappingJson))
            throw new ArgumentException("Grade mapping is empty", nameof(gradeMappingJson));

        var mapping = JsonSerializer.Deserialize<Dictionary<string, int>>(gradeMappingJson);
        if (mapping == null)
            throw new ArgumentException("Invalid grade mapping JSON", nameof(gradeMappingJson));

        // Попробуем точное совпадение
        if (mapping.TryGetValue(gradeRaw, out var exactIndex))
            return exactIndex;

        // Попробуем case-insensitive поиск
        var normalizedGrade = gradeRaw.ToUpperInvariant();
        foreach (var kvp in mapping)
        {
            if (kvp.Key.Equals(normalizedGrade, StringComparison.OrdinalIgnoreCase))
                return kvp.Value;
        }

        throw new ArgumentException($"Grade '{gradeRaw}' not found in mapping");
    }
}
