using MediatR;
using Cruxa.Application.Features.GymAdmin.Contracts;
using Cruxa.Application.Features.GymAdmin.DTOs;
using Cruxa.Application.Features.GymAdmin.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Handlers;

public sealed class GetGymActivityHandler(
    IGymAdminRepository adminRepo)
    : IRequestHandler<GetGymActivityQuery, Result<GymActivityDto>>
{
    public async Task<Result<GymActivityDto>> Handle(GetGymActivityQuery request, CancellationToken ct)
    {
        var dto = await adminRepo.GetActivityAsync(request.GymId);
        if (dto is null)
            return Result.Success(new GymActivityDto()); // empty stats, not an error

        return Result.Success(dto);
    }
}
