using MediatR;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class UpdateAscentHandler : IRequestHandler<UpdateAscentCommand, Result<AscentDto>>
{
    private readonly IAscentRepository _repository;
    private readonly IUnitOfWork _uow;

    public UpdateAscentHandler(IAscentRepository repository, IUnitOfWork uow) 
    { 
        _repository = repository; 
        _uow = uow; 
    }

    public async Task<Result<AscentDto>> Handle(UpdateAscentCommand request, CancellationToken ct)
    {
        var ascent = await _repository.GetByIdAsync(request.Id);
        if (ascent is null)
            return Result.Failure<AscentDto>(Error.NotFound("Ascent not found"));

        if (ascent.UserId != request.UserId)
            return Result.Failure<AscentDto>(Error.Unauthorized("You can only update your own ascents"));

        ascent.UpdateStyle(request.Style, request.MediaUrls);
        await _repository.UpdateAsync(ascent);
        await _uow.SaveChangesAsync(ct);

        var dto = new AscentDto
        {
            Id = ascent.Id,
            RouteId = ascent.RouteId,
            GradeRaw = ascent.Route?.Grade?.Raw ?? "",
            Style = ascent.Style,
            MediaUrls = ascent.MediaUrls.ToList(),
            CreatedAt = ascent.CreatedAt
        };
        return Result.Success(dto);
    }
}
