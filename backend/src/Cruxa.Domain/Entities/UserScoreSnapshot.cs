namespace Cruxa.Domain.Entities;

using Abstractions;

/// <summary>
/// Ежедневный снепшот крускора пользователя
/// </summary>
public class UserScoreSnapshot : Entity<Guid>
{
    public Guid UserId { get; private set; }
    public DateOnly Date { get; private set; }
    public double Score { get; set; }
    public double Confidence { get; set; }
    public int MaxGradeIndex { get; set; }
    public string? MaxGradeRaw { get; set; }
    public DateTime CreatedAt { get; set; }

    private UserScoreSnapshot() { } // For EF Core

    public UserScoreSnapshot(Guid userId, DateOnly date, double score, double confidence, int maxGradeIndex, string? maxGradeRaw = null)
        : base(Guid.NewGuid())
    {
        UserId = userId;
        Date = date;
        Score = score;
        Confidence = confidence;
        MaxGradeIndex = maxGradeIndex;
        MaxGradeRaw = maxGradeRaw;
        CreatedAt = DateTime.UtcNow;
    }
}
