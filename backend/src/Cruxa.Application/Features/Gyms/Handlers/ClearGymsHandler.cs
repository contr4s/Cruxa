using MediatR;
using Cruxa.Application.Features.Gyms.Contracts;
using Cruxa.Domain.Common;
using Cruxa.Application.Features.Gyms.Commands;

namespace Cruxa.Application.Features.Gyms.Handlers;

public class ClearGymsHandler(IGymRepository gyms) : IRequestHandler<ClearGymsCommand, Result>
{
    public async Task<Result> Handle(ClearGymsCommand cmd, CancellationToken ct)
    {
        await gyms.ClearAllAsync();
        return Result.Success();
    }
}
