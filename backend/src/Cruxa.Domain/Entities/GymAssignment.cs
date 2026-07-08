namespace Cruxa.Domain.Entities;

using Abstractions;
using Common;

/// <summary>
/// Привязка персонала (GymAdmin / Routesetter) к залу.
/// Один пользователь может иметь несколько записей (разные роли в разных залах).
/// </summary>
public class GymAssignment : Entity<Guid>
{
    public Guid GymId { get; private set; }
    public Guid UserId { get; private set; }
    public GymRoleInGym RoleInGym { get; private set; }

    // Navigation
    public Gym Gym { get; private set; } = null!;
    public User User { get; private set; } = null!;

    private GymAssignment() { }

    private GymAssignment(Guid gymId, Guid userId, GymRoleInGym roleInGym)
    {
        Id = Guid.NewGuid();
        GymId = gymId;
        UserId = userId;
        RoleInGym = roleInGym;
    }

    public static Result<GymAssignment> Create(Guid gymId, Guid userId, GymRoleInGym roleInGym)
    {
        Guard.AgainstDefault(gymId, nameof(gymId));
        Guard.AgainstDefault(userId, nameof(userId));

        return Result.Success(new GymAssignment(gymId, userId, roleInGym));
    }
}

public enum GymRoleInGym
{
    GymAdmin = 0,
    Routesetter = 1,
}
