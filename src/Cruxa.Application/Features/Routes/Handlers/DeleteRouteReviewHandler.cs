using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Commands;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Routes.Handlers;

public sealed class DeleteRouteReviewHandler : IRequestHandler<DeleteRouteReviewCommand, Result>
{
    private readonly IRouteReviewRepository _repository;
    private readonly IUnitOfWork _uow;

    public DeleteRouteReviewHandler(IRouteReviewRepository repository, IUnitOfWork uow)
    {
        _repository = repository;
        _uow = uow;
    }

    public async Task<Result> Handle(DeleteRouteReviewCommand request, CancellationToken ct)
    {
        var review = await _repository.GetByIdAsync(request.Id);
        if (review is null)
            return Result.Failure(Error.NotFound("Route review not found"));

        if (review.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only delete your own reviews"));

        await _repository.DeleteAsync(request.Id);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}
