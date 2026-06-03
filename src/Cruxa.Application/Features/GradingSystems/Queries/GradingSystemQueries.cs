using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GradingSystems.Queries;

public record GetGradingSystemByIdQuery(Guid Id) : IRequest<Result<GradingSystemDto>>;

public record GetGradingSystemByGymIdQuery(Guid GymId) : IRequest<Result<GradingSystemDto>>;

public record GetAllGradingSystemsQuery : IRequest<Result<IEnumerable<GradingSystemDto>>>;
