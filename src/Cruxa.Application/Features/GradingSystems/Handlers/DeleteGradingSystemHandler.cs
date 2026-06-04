using MediatR;
using Cruxa.Application.Features.GradingSystems.Commands;
using Cruxa.Application.Features.GradingSystems.Interfaces;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GradingSystems.Handlers;

public class DeleteGradingSystemHandler : IRequestHandler<DeleteGradingSystemCommand, Result>
{
    private readonly IGradingSystemRepository _repository;

    public DeleteGradingSystemHandler(IGradingSystemRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(DeleteGradingSystemCommand request, CancellationToken ct)
    {
        var entity = await _repository.GetByIdAsync(request.Id);
        if (entity is null)
            return Result.Failure(Error.NotFound("Grading system not found"));

        _repository.Remove(entity);
        return Result.Success();
    }
}
