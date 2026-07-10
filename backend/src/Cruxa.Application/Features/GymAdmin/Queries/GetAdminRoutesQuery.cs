using MediatR;
using Cruxa.Application.Features.Routes.DTOs;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.GymAdmin.Queries;

public record GetAdminRoutesQuery(Guid GymId, RouteFilter Filter) : IRequest<Result<OffsetPaginatedList<RouteDto>>>;
