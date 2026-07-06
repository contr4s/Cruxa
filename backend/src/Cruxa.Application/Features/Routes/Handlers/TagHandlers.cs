using MediatR;
using Cruxa.Application.Features.Routes.Interfaces;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetAllTagsHandler(ITagRepository tagRepo) : IRequestHandler<GetAllTagsQuery, Result<List<string>>>
{
    public async Task<Result<List<string>>> Handle(GetAllTagsQuery q, CancellationToken ct)
    {
        var tags = await tagRepo.GetAllTagsAsync();
        return Result.Success(tags.Select(t => t.Value).ToList());
    }
}
