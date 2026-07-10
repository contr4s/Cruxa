using MediatR;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Routes.Queries;

using Cruxa.Application.Features.Ascents.DTOs;

public record GetAllTagsQuery : IRequest<Result<List<TagDto>>>;
