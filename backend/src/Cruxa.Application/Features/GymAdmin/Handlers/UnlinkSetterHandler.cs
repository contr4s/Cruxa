using MediatR;
using Cruxa.Application.Features.GymAdmin.Commands;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Handlers;

public sealed class UnlinkSetterHandler(
    IGymAssignmentRepository gymAssignments)
    : IRequestHandler<UnlinkSetterCommand, Result>
{
    public async Task<Result> Handle(UnlinkSetterCommand request, CancellationToken ct)
    {
        var existing = await gymAssignments.GetByGymIdAsync(request.GymId);
        var assignment = existing.FirstOrDefault(a =>
            a.UserId == request.UserId && a.RoleInGym == Domain.Entities.GymRoleInGym.Routesetter);

        if (assignment is null)
            return Result.Success(); // idempotent

        await gymAssignments.DeleteRangeAsync([assignment]);
        return Result.Success();
    }
}
