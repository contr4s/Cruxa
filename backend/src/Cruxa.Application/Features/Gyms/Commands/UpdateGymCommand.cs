using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Contracts;

namespace Cruxa.Application.Features.Gyms.Commands;

using Domain.ValueObjects;

public record UpdateGymCommand(Guid Id, string? Name = null, string? City = null, string? Address = null,
    double? Latitude = null, double? Longitude = null, string? Description = null,
    string? ContactInfo = null, string? Website = null, List<PriceItem>? Prices = null,
    List<WorkingHoursEntry>? WorkingHours = null, List<string>? PhotoUrls = null, Guid? GradingSystemId = null,
    double? WallArea = null, double? MaxHeight = null, int? YearFounded = null,
    List<string>? MetroStations = null, List<string>? Tags = null) : IRequest<Result<GymDto>>, ICommand;
