using MediatR;
using Cruxa.Application.Features.GradingSystems.Contracts;
using Cruxa.Application.Features.GradingSystems.Queries;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GradingSystems.Handlers;

public class GetGradingSystemByIdHandler : IRequestHandler<GetGradingSystemByIdQuery, Result<GradingSystemDto>>
{
    private readonly IGradingSystemRepository _repository;

    public GetGradingSystemByIdHandler(IGradingSystemRepository repository)
        => _repository = repository;

    public async Task<Result<GradingSystemDto>> Handle(GetGradingSystemByIdQuery request, CancellationToken ct)
    {
        var entity = await _repository.GetByIdAsync(request.Id);
        if (entity is null)
            return Result.Failure<GradingSystemDto>(Error.NotFound("GradingSystem not found"));

        var dto = new GradingSystemDto
        {
            Id = entity.Id,
            Name = entity.Name,
            GradeMapping = entity.Mapping.Mapping.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
        };
        return Result.Success(dto);
    }
}
