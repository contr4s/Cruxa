using MediatR;
using Cruxa.Application.Features.Gyms.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GradingSystems.Queries;

public record GetAllGradingSystemsQuery : IRequest<Result<IEnumerable<GradingSystemDto>>>;
