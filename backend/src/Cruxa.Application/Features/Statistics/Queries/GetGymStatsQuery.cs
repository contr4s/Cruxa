using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Queries;

public record GetGymStatsQuery(Guid GymId) : IRequest<Result<GymStatsDto>>;