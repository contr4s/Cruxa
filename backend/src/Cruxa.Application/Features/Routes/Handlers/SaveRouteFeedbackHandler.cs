using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Application.Features.Routes.Contracts;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class SaveRouteFeedbackHandler : IRequestHandler<SaveRouteFeedbackCommand, Result>
{
    private readonly IRouteFeedbackRepository _repository;

    public SaveRouteFeedbackHandler(IRouteFeedbackRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(SaveRouteFeedbackCommand request, CancellationToken ct)
    {
        var existing = await _repository.GetByRouteAndUserAsync(request.RouteId, request.UserId);

        if (existing is not null)
        {
            existing.UpdateFeedback(request.Rating, request.PrivateNotes, request.PublicReview, request.GradeIndex);
            await _repository.UpdateAsync(existing);
        }
        else
        {
            var feedback = Domain.Entities.RouteFeedback.Create(
                request.RouteId,
                request.UserId,
                request.Rating,
                request.PrivateNotes,
                request.PublicReview,
                request.GradeIndex).Value!;
            await _repository.AddAsync(feedback);
        }

        return Result.Success();
    }
}
