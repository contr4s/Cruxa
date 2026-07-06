using MediatR;
using Cruxa.Application.Features.GradingSystems.Interfaces;
using Cruxa.Application.Features.GradingSystems.Queries;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GradingSystems.Handlers;

public class GetAllGradingSystemsHandler : IRequestHandler<GetAllGradingSystemsQuery, Result<IEnumerable<GradingSystemDto>>>
{
    private readonly IGradingSystemRepository _repository;

    public GetAllGradingSystemsHandler(IGradingSystemRepository repository)
        => _repository = repository;

    public async Task<Result<IEnumerable<GradingSystemDto>>> Handle(GetAllGradingSystemsQuery request, CancellationToken ct)
    {
        var entities = await _repository.GetAllAsync();
        var dtos = entities.Select(e => new GradingSystemDto
        {
            Id = e.Id,
            Name = e.Name,
            GradeMapping = e.Mapping.Mapping.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
        });
        return Result.Success(dtos);
    }
}
