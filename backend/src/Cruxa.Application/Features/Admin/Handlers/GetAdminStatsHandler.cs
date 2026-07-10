using MediatR;
using Cruxa.Application.Features.Admin.Contracts;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Application.Features.Admin.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Admin.Handlers;

public sealed class GetAdminStatsHandler(
    IAdminRepository adminRepo)
    : IRequestHandler<GetAdminStatsQuery, Result<AdminDashboardStatsDto>>
{
    public async Task<Result<AdminDashboardStatsDto>> Handle(GetAdminStatsQuery request, CancellationToken ct)
    {
        var (totalGyms, totalRoutes, totalSetters, monthlyAscents) = await adminRepo.GetStatsAsync();

        return Result.Success(new AdminDashboardStatsDto
        {
            TotalGyms = totalGyms,
            TotalRoutes = totalRoutes,
            TotalSetters = totalSetters,
            MonthlyAscents = monthlyAscents,
        });
    }
}
