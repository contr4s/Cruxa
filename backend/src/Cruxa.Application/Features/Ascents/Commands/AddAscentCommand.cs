using MediatR;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Ascents.Commands;

public record AddAscentCommand(
    Guid PostId,
    Guid UserId,
    Guid RouteId,
    AscentStyle Style,
    List<string>? MediaUrls = null) : IRequest<Result>, ICommand;
