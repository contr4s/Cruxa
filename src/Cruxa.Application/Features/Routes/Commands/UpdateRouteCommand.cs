using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Domain.Enums;

namespace Cruxa.Application.Features.Routes.Commands;

public record UpdateRouteCommand(Guid Id, RouteType? Type = null, HoldColor? HoldColor = null,
    List<string>? PhotoUrls = null, List<string>? Tags = null, string? Sector = null,
    bool? IsActive = null) : IRequest<Result>;
