using MediatR;
using Cruxa.Application.Features.Statistics.DTOs;
using Cruxa.Application.Features.Statistics.Contracts;
using Cruxa.Application.Features.Statistics.Queries;
using Cruxa.Application.Features.Users.Contracts;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Statistics.Handlers;

public sealed class GetKruscoreHistoryHandler(
    IUserRepository users,
    IStatsRepository statsRepo)
    : IRequestHandler<GetKruscoreHistoryQuery, Result<List<KruscorePointDto>>>
{
    public async Task<Result<List<KruscorePointDto>>> Handle(GetKruscoreHistoryQuery request, CancellationToken ct)
    {
        var user = await users.GetByIdAsync(request.UserId);
        if (user is null)
            return Result.Failure<List<KruscorePointDto>>(Error.NotFound("User not found"));

        var from = request.From is not null
            ? DateOnly.FromDateTime(request.From.Value)
            : DateOnly.MinValue;
        var to = request.To is not null
            ? DateOnly.FromDateTime(request.To.Value)
            : DateOnly.MaxValue;

        var snapshots = await statsRepo.GetSnapshotsAsync(request.UserId, from, to);

        var result = snapshots.Select(s => new KruscorePointDto
        {
            Date = s.Date,
            Score = s.Score,
            MaxGrade = s.MaxGradeRaw ?? s.MaxGradeIndex.ToString()
        }).ToList();

        return result;
    }
}
