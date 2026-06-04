using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Gyms.Commands;

public record UpdateGymCommand(Guid Id, string? Name = null, string? City = null, string? Address = null,
    double? Latitude = null, double? Longitude = null, string? Description = null,
    string? ContactInfo = null, string? Website = null, string? Prices = null,
    string? WorkingHours = null, List<string>? PhotoUrls = null, Guid? GradingSystemId = null) : IRequest<Result<GymDto>>;
