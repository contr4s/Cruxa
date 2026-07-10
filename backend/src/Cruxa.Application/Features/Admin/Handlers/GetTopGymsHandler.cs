using MediatR;
using Cruxa.Application.Features.Admin.Contracts;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Application.Features.Admin.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Admin.Handlers;

public sealed class GetTopGymsHandler(
    IAdminRepository adminRepo)
    : IRequestHandler<GetTopGymsQuery, Result<List<TopGymItemDto>>>
{
    public async Task<Result<List<TopGymItemDto>>> Handle(GetTopGymsQuery request, CancellationToken ct)
    {
        var result = await adminRepo.GetTopGymsAsync();
        return Result.Success(result);
    }
}
