using MediatR;
using Cruxa.Application.Features.Admin.DTOs;
using Cruxa.Application.Common.Models;
using Cruxa.Domain.Common;

namespace Cruxa.Application.Features.Admin.Queries;

public record GetAdminGymsQuery(
    int Page = 1,
    int PageSize = 10,
    string? City = null,
    string? Status = null,
    string? Sort = null) : IRequest<Result<OffsetPaginatedList<AdminGymItemDto>>>;
