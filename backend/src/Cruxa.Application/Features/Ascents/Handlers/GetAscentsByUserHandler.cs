using Mapster;
using MediatR;
using Cruxa.Application.Features.Ascents.Contracts;
using Cruxa.Application.Features.Ascents.Queries;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class GetAscentsByUserHandler : IRequestHandler<GetAscentsByUserQuery, Result<OffsetPaginatedList<AscentDto>>>
{
    private readonly IAscentRepository _repository;

    public GetAscentsByUserHandler(IAscentRepository repository) => _repository = repository;

    public async Task<Result<OffsetPaginatedList<AscentDto>>> Handle(GetAscentsByUserQuery request, CancellationToken ct)
    {
        var (items, totalCount) = await _repository.GetByUserPagedAsync(request.UserId, request.Page, request.PageSize);
        var dtos = items.Select(a => a.Adapt<AscentDto>()).ToList();
        return Result.Success(new OffsetPaginatedList<AscentDto>(dtos, totalCount, request.Page, request.PageSize));
    }
}
