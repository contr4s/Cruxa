using MediatR;
using Microsoft.Extensions.Logging;
using Cruxa.Application.Features.GradingSystems.Commands;
using Cruxa.Application.Features.GradingSystems.Contracts;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GradingSystems.Handlers;

public class UpdateGradingSystemHandler : IRequestHandler<UpdateGradingSystemCommand, Result<GradingSystemDto>>
{
    private readonly IGradingSystemRepository _repository;
    private readonly ILogger<UpdateGradingSystemHandler> _logger;

    public UpdateGradingSystemHandler(IGradingSystemRepository repository, ILogger<UpdateGradingSystemHandler> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result<GradingSystemDto>> Handle(UpdateGradingSystemCommand request, CancellationToken ct)
    {
        var entity = await _repository.GetByIdAsync(request.Id);
        if (entity is null)
            return Result.Failure<GradingSystemDto>(Error.NotFound("Grading system not found"));

        try
        {
            entity.Update(request.Name, request.GradeMapping);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Failed to update grading system {Id}: {Message}", request.Id, ex.Message);
            return Result.Failure<GradingSystemDto>(Error.Validation(ex.Message));
        }

        

        return Result.Success(new GradingSystemDto
        {
            Id = entity.Id,
            Name = entity.Name,
            GradeMapping = entity.Mapping.Mapping.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
        });
    }
}
