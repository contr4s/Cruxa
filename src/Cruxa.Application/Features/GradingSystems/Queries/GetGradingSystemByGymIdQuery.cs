using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GradingSystems.Queries;

public record GetGradingSystemByGymIdQuery(Guid GymId) : IRequest<Result<GradingSystemDto>>;
