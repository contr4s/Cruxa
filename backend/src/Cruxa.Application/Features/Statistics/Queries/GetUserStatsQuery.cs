using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Queries;

public record GetUserStatsQuery(Guid UserId) : IRequest<Result<UserStatsDto>>;