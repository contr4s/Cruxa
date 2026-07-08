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
    public DateTime CreatedAt { get; set; }

    private UserScoreSnapshot() { } // For EF Core

    public UserScoreSnapshot(Guid userId, DateOnly date, double score, double confidence, int maxGradeIndex)
        : base(Guid.NewGuid())
    {
        UserId = userId;
        Date = date;
        Score = score;
        Confidence = confidence;
        MaxGradeIndex = maxGradeIndex;
        CreatedAt = DateTime.UtcNow;
    }
}
