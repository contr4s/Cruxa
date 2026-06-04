namespace Cruxa.Domain.Entities;

using System.Text.Json;
using Abstractions;
using Common;
using ValueObjects;

/// <summary>
/// Система оценок/грейдов (Aggregate Root)
/// </summary>
public class GradingSystem : AggregateRoot<Guid>
{
    public string Name { get; private set; }

    /// <summary>
    /// JSON строка маппинга для EF Core (jsonb)
    /// </summary>
    private string _gradeMappingJson = "{}";
    public string GradeMappingJson => _gradeMappingJson;

    /// <summary>
    /// Value Object маппинга (используется в domain логике)
    /// </summary>
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public GradeMapping Mapping => CreateMapping();

    private GradeMapping CreateMapping()
    {
        var dict = JsonSerializer.Deserialize<Dictionary<string, int>>(_gradeMappingJson) ?? [];
        return GradeMapping.Create(dict).Value!;
    }

    // For EF Core
    private GradingSystem() { }

    public GradingSystem(Guid id, string name, Dictionary<string, int> mapping)
    {
        Id = id;
        Name = name;
        _gradeMappingJson = JsonSerializer.Serialize(mapping);
    }

    public static Result<GradingSystem> Create(string name, Dictionary<string, int> mapping)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));

        var mappingResult = GradeMapping.Create(mapping);
        if (mappingResult.IsFailure) return Result.Failure<GradingSystem>(mappingResult.Error);

        return Result.Success(new GradingSystem(Guid.NewGuid(), name.Trim(), mapping));
    }

    public Result<Grade> ResolveGrade(string raw)
    {
        return Mapping.ResolveGrade(raw);
    }

    public void Update(string name, Dictionary<string, int> mapping)
    {
        Guard.AgainstNullOrWhiteSpace(name, nameof(name));

        var mappingResult = GradeMapping.Create(mapping);
        if (mappingResult.IsFailure)
            throw new ArgumentException(mappingResult.Error.Message);

        Name = name.Trim();
        _gradeMappingJson = JsonSerializer.Serialize(mapping);
    }

    // Navigation properties
    private readonly List<Gym> _gyms = [];
    public IReadOnlyCollection<Gym> Gyms => _gyms.AsReadOnly();
}
