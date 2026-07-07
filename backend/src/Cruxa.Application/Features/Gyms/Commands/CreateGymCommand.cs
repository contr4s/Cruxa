using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Interfaces;

namespace Cruxa.Application.Features.Gyms.Commands;

using Domain.ValueObjects;

public record CreateGymCommand(string Name, string City, string Address, double? Latitude = null, double? Longitude = null,
    string? Description = null, string? ContactInfo = null, string? Website = null,
    List<PriceItem>? Prices = null, List<WorkingHoursEntry>? WorkingHours = null,
    List<string>? PhotoUrls = null, Guid? GradingSystemId = null) : IRequest<Result<GymDto>>, ICommand;
