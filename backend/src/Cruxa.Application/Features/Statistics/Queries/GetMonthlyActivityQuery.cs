using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Queries;

public record GetMonthlyActivityQuery(
    Guid UserId,
    int Year,
    int Month
) : IRequest<Result<MonthlyActivityDto>>;