using MediatR;
using Cruxa.Application.Features.GymAdmin.Commands;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.GymAdmin.Handlers;

public sealed class LinkSetterHandler(
    IGymAssignmentRepository gymAssignments)
    : IRequestHandler<LinkSetterCommand, Result>
{
    public async Task<Result> Handle(LinkSetterCommand request, CancellationToken ct)
    {
        // Check if already exists
        var existing = await gymAssignments.GetByGymIdAsync(request.GymId);
        if (existing.Any(a => a.UserId == request.UserId && a.RoleInGym == Domain.Entities.GymRoleInGym.Routesetter))
            return Result.Success(); // idempotent

        var assignment = GymAssignment.Create(request.GymId, request.UserId, Domain.Entities.GymRoleInGym.Routesetter);
        if (assignment.IsFailure)
            return Result.Failure(assignment.Error);

        await gymAssignments.AddAsync(assignment.Value);
        return Result.Success();
    }
}
