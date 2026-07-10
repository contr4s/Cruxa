using MediatR;
using Cruxa.Application.Features.Admin.Contracts;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Application.Features.Admin.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Admin.Handlers;

public sealed class GetRecentActivityHandler(
    IAdminRepository adminRepo)
    : IRequestHandler<GetRecentActivityQuery, Result<List<RecentActivityItemDto>>>
{
    public async Task<Result<List<RecentActivityItemDto>>> Handle(GetRecentActivityQuery request, CancellationToken ct)
    {
        var result = await adminRepo.GetRecentActivityAsync();
        return Result.Success(result);
    }
}
