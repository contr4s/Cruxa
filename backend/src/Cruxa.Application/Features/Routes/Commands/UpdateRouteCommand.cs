using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Routes.Commands;

public record UpdateRouteCommand(
    Guid Id,
    string? Name = null,
    RouteType? Type = null,
    HoldColor? HoldColor = null,
    string? GradeRaw = null,
    List<string>? PhotoUrls = null,
    List<string>? Tags = null,
    string? Sector = null,
    bool? IsActive = null) : IRequest<Result>, ICommand;
