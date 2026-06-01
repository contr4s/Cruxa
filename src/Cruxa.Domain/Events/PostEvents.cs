namespace Cruxa.Domain.Events;

public sealed record PostCreatedEvent(Guid PostId, Guid UserId, Guid GymId) : DomainEvent;
public sealed record PostPublishedEvent(Guid PostId) : DomainEvent;
