namespace Cruxa.Domain.Abstractions;

/// <summary>
/// Базовый класс для Entity (DDD)
/// </summary>
public abstract class Entity<TId> : IEquatable<Entity<TId>>
    where TId : IEquatable<TId>
{
    public TId Id { get; set; }

    protected Entity() { } // For EF Core

    protected Entity(TId id) => Id = id;

    public override bool Equals(object? obj)
        => obj is Entity<TId> other && Id.Equals(other.Id);

    public bool Equals(Entity<TId>? other)
        => other is not null && Id.Equals(other.Id);

    public override int GetHashCode()
        => Id.GetHashCode();

    public static bool operator ==(Entity<TId> left, Entity<TId> right)
        => left is null ? right is null : left.Equals(right);

    public static bool operator !=(Entity<TId> left, Entity<TId> right)
        => left is null ? right is not null : !left.Equals(right);
}
