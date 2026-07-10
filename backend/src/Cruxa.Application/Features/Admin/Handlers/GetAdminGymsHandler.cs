using MediatR;
using Cruxa.Application.Features.Admin.Contracts;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Application.Features.Admin.Queries;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Admin.Handlers;

public sealed class GetAdminGymsHandler(
    IAdminRepository adminRepo)
    : IRequestHandler<GetAdminGymsQuery, Result<OffsetPaginatedList<AdminGymItemDto>>>
{
    public async Task<Result<OffsetPaginatedList<AdminGymItemDto>>> Handle(GetAdminGymsQuery request, CancellationToken ct)
    {
        var (items, totalCount) = await adminRepo.GetGymsPagedAsync(
            request.Page, request.PageSize, request.City, request.Status, request.Sort);

        return Result.Success(new OffsetPaginatedList<AdminGymItemDto>(items, totalCount, request.Page, request.PageSize));
    }
}
