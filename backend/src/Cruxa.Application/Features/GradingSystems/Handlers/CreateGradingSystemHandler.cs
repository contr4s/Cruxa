using MediatR;
using Cruxa.Application.Features.GradingSystems.Commands;
using Cruxa.Application.Features.GradingSystems.Interfaces;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Entities;

namespace Cruxa.Application.Features.GradingSystems.Handlers;

public class CreateGradingSystemHandler : IRequestHandler<CreateGradingSystemCommand, Result<GradingSystemDto>>
{
    private readonly IGradingSystemRepository _repository;

    public CreateGradingSystemHandler(IGradingSystemRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<GradingSystemDto>> Handle(CreateGradingSystemCommand request, CancellationToken ct)
    {
        var result = GradingSystem.Create(request.Name, request.GradeMapping);
        if (result.IsFailure)
            return Result.Failure<GradingSystemDto>(result.Error);

        var entity = result.Value!;
        await _repository.AddAsync(entity, ct);

        return Result.Success(new GradingSystemDto
        {
            Id = entity.Id,
            Name = entity.Name,
            GradeMapping = entity.Mapping.Mapping.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
        });
    }
}
