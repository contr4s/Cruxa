using Mapster;
using MediatR;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class GetAscentsByPostHandler : IRequestHandler<GetAscentsByPostQuery, Result<OffsetPaginatedList<AscentDto>>>
{
    private readonly IAscentRepository _repository;

    public GetAscentsByPostHandler(IAscentRepository repository) => _repository = repository;

    public async Task<Result<OffsetPaginatedList<AscentDto>>> Handle(GetAscentsByPostQuery request, CancellationToken ct)
    {
        var ascents = await _repository.GetByPostIdAsync(request.PostId);
        var dtos = ascents.Select(a => a.Adapt<AscentDto>()).ToList();
        var total = dtos.Count;
        var paged = dtos.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToList();
        return Result.Success(new OffsetPaginatedList<AscentDto>(paged, total, request.Page, request.PageSize));
    }
}
