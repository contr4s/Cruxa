using MediatR;
using Cruxa.Application.Features.Ascents.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Ascents.Queries;

public record GetAscentsByPostQuery(Guid PostId, int Page = 1, int PageSize = 20) : IRequest<Result<OffsetPaginatedList<AscentDto>>>;
