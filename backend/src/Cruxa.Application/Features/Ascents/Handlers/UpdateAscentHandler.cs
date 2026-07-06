using MediatR;
using Cruxa.Application.Features.Ascents.Interfaces;
using Cruxa.Application.Features.Ascents.Commands;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Ascents.Handlers;

public sealed class UpdateAscentHandler : IRequestHandler<UpdateAscentCommand, Result<AscentDto>>
{
    private readonly IAscentRepository _repository;

    public UpdateAscentHandler(IAscentRepository repository) 
    { 
        _repository = repository; 
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
