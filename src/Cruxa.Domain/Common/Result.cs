namespace Cruxa.Domain.Common;

/// <summary>
/// Base Result type for representing success or failure without exceptions
/// </summary>
public abstract class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; } = Error.None;

    protected Result(bool isSuccess, Error error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new SuccessResult();

    public static Result<T> Success<T>(T value) => new SuccessResult<T>(value);

    public static Result<T> Failure<T>(Error error) => new FailureResult<T>(error);

    /// <summary>
    /// Create a failed non-generic Result
    /// </summary>
    public static Result Failure(Error error) => new FailureResult(error);

    private sealed class FailureResult : Result
    {
        public FailureResult(Error error) : base(false, error) { }
    }

    private sealed class SuccessResult : Result
    {
        public SuccessResult() : base(true, Error.None) { }
    }

    private sealed class SuccessResult<T> : Result<T>
    {
        public SuccessResult(T value) : base(true, Error.None, value) { }
    }

    private sealed class FailureResult<T> : Result<T>
    {
        public FailureResult(Error error) : base(false, error, default!) { }
    }
}

/// <summary>
/// Result with a value of type T
/// </summary>
public abstract class Result<T> : Result
{
    public T? Value { get; }

    protected Result(bool isSuccess, Error error, T? value) : base(isSuccess, error)
    {
        Value = value;
    }

    public static implicit operator Result<T>(T value) => Success(value);

    public static implicit operator Result<T>(Error error) => Failure<T>(error);
}
