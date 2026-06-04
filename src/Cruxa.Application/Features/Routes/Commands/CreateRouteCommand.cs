using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Routes.Commands;

public record CreateRouteCommand(Guid GymId, string GradeRaw, RouteType Type, HoldColor HoldColor,
    Guid? AuthorId = null, List<string>? PhotoUrls = null, List<string>? Tags = null,
    string? Sector = null) : IRequest<Result<RouteDto>>, ICommand;
