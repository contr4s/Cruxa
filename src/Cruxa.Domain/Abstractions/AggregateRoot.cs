using Cruxa.Domain.Events;

namespace Cruxa.Domain.Abstractions;

/// <summary>
/// Aggregate Root - the entry point to aggregate's consistency boundary
/// </summary>
public abstract class AggregateRoot<TId> : Entity<TId>
    where TId : IEquatable<TId>
{
    protected AggregateRoot() { }

    protected AggregateRoot(TId id) : base(id) { }

    public void RaiseDomainEvent(IDomainEvent domainEvent)
        => AddDomainEvent(domainEvent);

    protected void ClearUncommittedEvents()
        => ClearDomainEvents();
}
