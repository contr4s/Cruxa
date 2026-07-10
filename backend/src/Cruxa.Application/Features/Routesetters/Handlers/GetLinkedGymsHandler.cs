using MediatR;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routesetters.DTOs;
using Cruxa.Application.Features.Routesetters.Queries;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Cruxa.Application.Features.Routesetters.Handlers;

public sealed class GetLinkedGymsHandler(
    IGymAssignmentRepository gymAssignments,
    IRouteRepository routes,
    ICurrentUserService currentUser,
    ILogger<GetLinkedGymsHandler> logger)
    : IRequestHandler<GetLinkedGymsQuery, Result<List<LinkedGymSummaryDto>>>
{
    public async Task<Result<List<LinkedGymSummaryDto>>> Handle(GetLinkedGymsQuery request, CancellationToken ct)
    {
        var userId = currentUser.GetRequiredUserId();

        var assignments = await gymAssignments.GetByUserIdAsync(userId);
        var setterAssignments = assignments
            .Where(a => a.RoleInGym == Domain.Entities.GymRoleInGym.Routesetter)
            .ToList();

        var dtos = new List<LinkedGymSummaryDto>();

        foreach (var assignment in setterAssignments)
        {
            var gym = assignment.Gym;
            if (gym is null) continue;

            // Count active routes for this gym by this setter
            var activeCount = 0;
            double rating = 0;
            try
            {
                var filter = new Routes.DTOs.RouteFilter
                {
                    GymId = gym.Id,
                    AuthorId = userId,
                    IsActive = true,
                    PageSize = int.MaxValue,
                };
                var (items, _) = await routes.GetFilteredRoutesAsync(filter);
                activeCount = items.Count;
                var ratedItems = items.Where(r => r.Feedbacks.Any(f => f.Rating.HasValue)).ToList();
                rating = ratedItems.Count > 0
                    ? Math.Round(ratedItems.Average(r => r.Feedbacks.Where(f => f.Rating.HasValue).Average(f => f.Rating.Value)), 1)
                    : 0;
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to load stats for linked gym {GymId}", gym.Id);
            }

            dtos.Add(new LinkedGymSummaryDto
            {
                Id = gym.Id,
                Name = gym.Name,
                City = gym.City ?? "",
                Address = gym.Address,
                ActiveRouteCount = activeCount,
                Rating = rating,
            });
        }

        return Result.Success(dtos);
    }
}
