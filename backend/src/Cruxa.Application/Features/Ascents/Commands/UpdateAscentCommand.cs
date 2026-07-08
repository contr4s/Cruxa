using MediatR;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Ascents.Commands;

public record UpdateAscentCommand(
    Guid Id,
    Guid UserId,
    AscentStyle Style,
    List<string>? MediaUrls = null) : IRequest<Result<AscentDto>>, ICommand;
