namespace Cruxa.Domain.Exceptions;

/// <summary>
/// Базовое исключение доменной логики
/// </summary>
public class DomainException : Exception
{
    public DomainException() : base() { }

    public DomainException(string message) : base(message) { }

    public DomainException(string message, Exception innerException) : base(message, innerException) { }
}
