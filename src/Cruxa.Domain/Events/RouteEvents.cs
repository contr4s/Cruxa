namespace Cruxa.Domain.Events;

public sealed record RouteDeactivatedEvent(Guid RouteId) : DomainEvent;
