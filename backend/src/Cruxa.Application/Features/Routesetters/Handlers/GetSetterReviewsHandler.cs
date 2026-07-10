using MediatR;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routesetters.DTOs;
using Cruxa.Application.Features.Routesetters.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routesetters.Handlers;

public sealed class GetSetterReviewsHandler(
    IRouteFeedbackRepository feedbackRepo,
    ICurrentUserService currentUser)
    : IRequestHandler<GetSetterReviewsQuery, Result<List<RouteReviewSummaryDto>>>
{
    public async Task<Result<List<RouteReviewSummaryDto>>> Handle(GetSetterReviewsQuery request, CancellationToken ct)
    {
        var userId = currentUser.GetRequiredUserId();

        // Get all feedbacks for routes where current user is the author
        var allFeedback = await feedbackRepo.GetByUserIdAsync(userId);

        var dtos = allFeedback.Select(f => new RouteReviewSummaryDto
        {
            Id = f.Id,
            RouteId = f.RouteId,
            RouteName = f.Route?.Name ?? "",
            RouteGrade = f.Route?.Grade.Raw ?? "",
            UserId = f.UserId,
            Username = f.User?.Username ?? "",
            DisplayName = f.User is not null ? $"{f.User.FirstName} {f.User.LastName}".Trim() : null,
            UserAvatarUrl = f.User?.AvatarUrl,
            Rating = f.Rating,
            Comment = f.PublicReview,
            CreatedAt = f.CreatedAt,
        }).ToList();

        return Result.Success(dtos);
    }
}
