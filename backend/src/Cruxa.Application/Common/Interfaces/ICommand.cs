namespace Cruxa.Application.Common.Interfaces;

/// <summary>
/// Marker interface for all command requests (write operations).
/// Used by TransactionBehavior to distinguish commands from queries,
/// </summary>
public interface ICommand;
