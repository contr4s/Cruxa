using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Domain.Common;
using Cruxa.Application.Common.Models;

namespace Cruxa.Application.Features.Routes.Queries;

public record GetAllRoutesQuery(int Page = 1, int PageSize = 20) : IRequest<Result<OffsetPaginatedList<RouteDto>>>;
