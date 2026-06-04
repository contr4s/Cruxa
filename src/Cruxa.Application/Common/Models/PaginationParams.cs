namespace Cruxa.Application.Common.Models;

/// <summary>
/// Parameters for paginated queries
/// </summary>
public record PaginationParams
{
    private const int MaxPageSize = 100;
    private const int DefaultPageSize = 20;

    private int _page = 1;
    private int _pageSize = DefaultPageSize;

    public int Page
    {
        get => _page;
        init => _page = Math.Max(1, value);
    }

    public int PageSize
    {
        get => _pageSize;
        init => _pageSize = Math.Clamp(value, 1, MaxPageSize);
    }
}
