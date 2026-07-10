using MediatR;
using Cruxa.Application.Features.Routes.Contracts;
using Cruxa.Application.Features.Routes.Queries;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Handlers;

public class GetAllTagsHandler(ITagRepository tagRepo) : IRequestHandler<GetAllTagsQuery, Result<List<TagDto>>>
{
    public async Task<Result<List<TagDto>>> Handle(GetAllTagsQuery q, CancellationToken ct)
    {
        var tags = await tagRepo.GetAllTagsAsync();
        return Result.Success(tags.Select(t => new TagDto { Name = t.Value, Category = t.Category ?? "default" }).ToList());
    }
}
