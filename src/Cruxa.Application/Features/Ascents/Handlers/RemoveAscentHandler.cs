using MediatR;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Domain.Common;
namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class RemoveAscentHandler : IRequestHandler<RemoveAscentCommand, Result>
{
    private readonly IAscentRepository _repository;

    public RemoveAscentHandler(IAscentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(RemoveAscentCommand request, CancellationToken ct)
    {
        var ascent = await _repository.GetByIdAsync(request.Id);
        if (ascent is null)
            return Result.Failure(Error.NotFound("Ascent not found"));

        if (ascent.UserId != request.UserId)
            return Result.Failure(Error.Unauthorized("You can only remove your own ascents"));

        await _repository.DeleteAsync(request.Id);
        return Result.Success();
    }
}
