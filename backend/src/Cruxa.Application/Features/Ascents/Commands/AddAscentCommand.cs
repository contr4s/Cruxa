using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Contracts;
using Cruxa.Application.Features.Ascents.DTOs;

namespace Cruxa.Application.Features.Ascents.Commands;

public record AddAscentCommand(
    Guid PostId,
    Guid UserId,
    Guid RouteId,
    AscentStyle Style,
    List<string>? MediaUrls = null) : IRequest<Result<AscentDto>>, ICommand;
