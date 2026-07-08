using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Queries;

public record GetKruscoreHistoryQuery(
    Guid UserId,
    DateTime? From,
    DateTime? To
) : IRequest<Result<List<KruscorePointDto>>>;