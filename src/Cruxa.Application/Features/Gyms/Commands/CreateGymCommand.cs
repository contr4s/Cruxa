using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Gyms.Commands;

public record CreateGymCommand(string Name, string City, string Address, double Latitude, double Longitude,
    string? Description = null, string? ContactInfo = null, string? Website = null,
    string? Prices = null, string? WorkingHours = null,
    List<string>? PhotoUrls = null, Guid? GradingSystemId = null) : IRequest<Result<GymDto>>;
