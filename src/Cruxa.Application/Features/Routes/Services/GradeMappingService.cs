namespace Cruxa.Application.Features.Routes.Services;
using System.Text.Json;
public class GradeMappingService : IGradeMappingService
{
    public int CalculateGradeIndex(string gradeRaw, string gradeMappingJson)
    {
        if (string.IsNullOrEmpty(gradeMappingJson)) throw new ArgumentException("Grade mapping is empty", nameof(gradeMappingJson));
        var mapping = JsonSerializer.Deserialize<Dictionary<string, int>>(gradeMappingJson);
        if (mapping == null) throw new ArgumentException("Invalid grade mapping JSON", nameof(gradeMappingJson));
        if (mapping.TryGetValue(gradeRaw, out var idx)) return idx;
        var norm = gradeRaw.ToUpperInvariant();
        foreach (var kv in mapping) if (kv.Key.Equals(norm, StringComparison.OrdinalIgnoreCase)) return kv.Value;
        throw new ArgumentException($"Grade '{gradeRaw}' not found in mapping");
    }
}
