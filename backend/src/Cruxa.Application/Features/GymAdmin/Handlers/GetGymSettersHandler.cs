using MediatR;
using Cruxa.Application.Features.GymAdmin.DTOs;
using Cruxa.Application.Features.GymAdmin.Queries;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Domain.Common;
using Microsoft.Extensions.Logging;

namespace Cruxa.Application.Features.GymAdmin.Handlers;

public sealed class GetGymSettersHandler(
    IGymAssignmentRepository gymAssignments,
    IRouteRepository routes,
    ILogger<GetGymSettersHandler> logger)
    : IRequestHandler<GetGymSettersQuery, Result<List<SetterManagementItemDto>>>
{
    public async Task<Result<List<SetterManagementItemDto>>> Handle(GetGymSettersQuery request, CancellationToken ct)
    {
        var assignments = await gymAssignments.GetByGymIdAsync(request.GymId);
        var setterAssignments = assignments
            .Where(a => a.RoleInGym == Domain.Entities.GymRoleInGym.Routesetter)
            .ToList();

        var dtos = new List<SetterManagementItemDto>();

        foreach (var assignment in setterAssignments)
        {
            var user = assignment.User;
            if (user is null) continue;

            var activeRoutes = 0;
            double avgRating = 0;
            try
            {
                var filter = new Routes.DTOs.RouteFilter
                {
                    GymId = request.GymId,
                    AuthorId = user.Id,
                    IsActive = true,
                    PageSize = int.MaxValue,
                };
                var (items, _) = await routes.GetFilteredRoutesAsync(filter);
                activeRoutes = items.Count;
                var ratedItems = items.Where(r => r.Feedbacks.Any(f => f.Rating.HasValue)).ToList();
                avgRating = ratedItems.Count > 0
                    ? Math.Round(ratedItems.Average(r => r.Feedbacks.Where(f => f.Rating.HasValue).Average(f => f.Rating.Value)), 1)
                    : 0;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to load stats for setter {UserId} in gym {GymId}", user.Id, request.GymId);
            }

            dtos.Add(new SetterManagementItemDto
            {
                Id = user.Id,
                Name = $"{user.FirstName} {user.LastName}".Trim(),
                AvatarUrl = user.AvatarUrl,
                ActiveRoutes = activeRoutes,
                AverageRating = avgRating,
                Email = user.Email.Value,
            });
        }

        return Result.Success(dtos);
    }
}
