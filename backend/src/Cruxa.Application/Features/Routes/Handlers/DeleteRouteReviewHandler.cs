using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class DeleteRouteReviewHandler : IRequestHandler<DeleteRouteReviewCommand, Result>
{
    private readonly IRouteReviewRepository _repository;

    public DeleteRouteReviewHandler(IRouteReviewRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(DeleteRouteReviewCommand request, CancellationToken ct)
    {
        var review = await _repository.GetByIdAsync(request.Id);
        if (review is null)
            return Result.Failure(Error.NotFound("Route review not found"));

        if (review.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only delete your own reviews"));

        await _repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
