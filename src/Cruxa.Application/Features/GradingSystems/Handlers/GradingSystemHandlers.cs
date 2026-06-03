using MediatR;
using Cruxa.Application.Features.GradingSystems.Interfaces;
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

public class GetGradingSystemByGymIdHandler : IRequestHandler<GetGradingSystemByGymIdQuery, Result<GradingSystemDto>>
{
    private readonly IGradingSystemRepository _repository;

    public GetGradingSystemByGymIdHandler(IGradingSystemRepository repository)
        => _repository = repository;

    public async Task<Result<GradingSystemDto>> Handle(GetGradingSystemByGymIdQuery request, CancellationToken ct)
    {
        var entity = await _repository.GetByGymIdAsync(request.GymId);
        if (entity is null)
            return Result.Failure<GradingSystemDto>(Error.NotFound("GradingSystem not found for this gym"));

        var dto = new GradingSystemDto
        {
            Id = entity.Id,
            Name = entity.Name,
            GradeMapping = entity.Mapping.Mapping.ToDictionary(kvp => kvp.Key, kvp => kvp.Value)
        };
        return Result.Success(dto);
    }
}

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
