using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.Commands;
using Cruxa.Application.Features.Gyms.Contracts;

namespace Cruxa.Application.Features.Gyms.Handlers;

public sealed class ToggleGymFavoriteHandler : IRequestHandler<ToggleGymFavoriteCommand, Result>
{
    private readonly IGymFavoriteRepository _repository;

    public ToggleGymFavoriteHandler(IGymFavoriteRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(ToggleGymFavoriteCommand request, CancellationToken ct)
    {
        var isFavorite = await _repository.IsFavoriteAsync(request.UserId, request.GymId);

        if (isFavorite)
            await _repository.RemoveAsync(request.UserId, request.GymId);
        else
            await _repository.AddAsync(request.UserId, request.GymId);

        return Result.Success();
    }
}
