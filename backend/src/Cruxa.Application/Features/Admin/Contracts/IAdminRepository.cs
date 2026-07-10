using Cruxa.Application.Features.Admin.DTOs;

namespace Cruxa.Application.Features.Admin.Contracts;

public interface IAdminRepository
{
    Task<(int TotalGyms, int TotalRoutes, int TotalSetters, int MonthlyAscents)> GetStatsAsync();
    Task<List<RecentActivityItemDto>> GetRecentActivityAsync(int count = 20);
    Task<List<TopGymItemDto>> GetTopGymsAsync(int count = 10);
    Task<(List<AdminGymItemDto> Items, int TotalCount)> GetGymsPagedAsync(int page, int pageSize, string? city, string? status, string? sort);
}
