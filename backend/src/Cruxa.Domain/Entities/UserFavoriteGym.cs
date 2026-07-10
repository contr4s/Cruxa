namespace Cruxa.Domain.Entities;

using Common;

/// <summary>
/// Избранный скалодром пользователя
/// </summary>
public class UserFavoriteGym
{
    public Guid UserId { get; private set; }
    public Guid GymId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation properties
    public User User { get; private set; } = null!;
    public Gym Gym { get; private set; } = null!;

    private UserFavoriteGym() { }

    public static Result<UserFavoriteGym> Create(Guid userId, Guid gymId)
    {
        Guard.AgainstDefault(userId, nameof(userId));
        Guard.AgainstDefault(gymId, nameof(gymId));

        return Result.Success(new UserFavoriteGym
        {
            UserId = userId,
            GymId = gymId,
            CreatedAt = DateTime.UtcNow
        });
    }
}
