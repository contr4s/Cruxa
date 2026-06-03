namespace Cruxa.Domain.Abstractions;

using Events;

/// <summary>
/// Базовый класс для Entity (DDD)
/// </summary>
public abstract class Entity<TId> : IEquatable<Entity<TId>>
    where TId : IEquatable<TId>
{
    private readonly List<IDomainEvent> _domainEvents = [];

    public TId Id { get; set; }

    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected Entity() { } // For EF Core

    protected Entity(TId id) => Id = id;

    protected void AddDomainEvent(IDomainEvent domainEvent)
        => _domainEvents.Add(domainEvent);

    protected void ClearDomainEvents()
        => _domainEvents.Clear();

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
