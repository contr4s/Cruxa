using MediatR;
using Microsoft.Extensions.Logging;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.Commands;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class ClearGymsHandler(IGymRepository gyms, ILogger<ClearGymsHandler> logger) : IRequestHandler<ClearGymsCommand, Result>
{
    public async Task<Result> Handle(ClearGymsCommand cmd, CancellationToken ct)
    {
        logger.LogInformation("Clearing all gyms from database");
        await gyms.ClearAllAsync();
        return Result.Success();
    }
}
