namespace Cruxa.Domain.Events;

public sealed record UserRegisteredEvent(Guid UserId, string Email) : DomainEvent;
